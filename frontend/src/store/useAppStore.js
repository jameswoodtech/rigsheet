import { create } from 'zustand';
import { endpoints } from '../config/api';

/**
 * Global application state with separated loading domains:
 * - appReady:   only for initial app bootstrap (App.js splash)
 * - publicLoading/modsLoading: page-level fetch states (no splash flicker)
 *
 * Keep API flows predictable:
 * - hydrateAll(): boot user + vehicle (+mods) once at app start
 * - fetchPublicVehicleInfo(): public profile vehicle
 * - fetchModsForVehicle(): mods for a given vehicle id
 */
const useAppStore = create((set, get) => ({
  // ---------------------------------------------------------------------------
  // Session / static
  // ---------------------------------------------------------------------------
  userId: '1', // TODO: replace with real auth

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------
  userProfile: null,
  vehicleInfo: null,
  publicVehicleInfo: null,
  mods: [],

  // ---------------------------------------------------------------------------
  // UI state
  // ---------------------------------------------------------------------------
  isSidebarOpen: false,

  // App bootstrap state (used by App.js to show the global LoadingScreen)
  appReady: false,
  setAppReady: (v) => set({ appReady: v }),

  // Page/slice-level loading + errors (do NOT trigger the global splash)
  publicLoading: false,
  publicError: null,
  modsLoading: false,
  modsError: null,

  // ---------------------------------------------------------------------------
  // UI actions
  // ---------------------------------------------------------------------------
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // ---------------------------------------------------------------------------
  // Local setters
  // ---------------------------------------------------------------------------
  setUserProfile: (userProfile) => set({ userProfile }),
  setVehicleInfo: (vehicleInfo) => set({ vehicleInfo }),
  setPublicVehicleInfo: (publicVehicleInfo) => set({ publicVehicleInfo }),
  setMods: (mods) => set({ mods }),

  // ---------------------------------------------------------------------------
  // Low-level fetchers
  // ---------------------------------------------------------------------------
  fetchUserProfile: async (id) => {
    const res = await fetch(endpoints.userProfileById(id));
    if (!res.ok) throw new Error(`Failed to load user profile ${id}`);
    return res.json();
  },

  fetchVehicleForUser: async (userId) => {
    const res = await fetch(endpoints.vehicleByUserId(userId));
    if (!res.ok) throw new Error(`Failed to load vehicle for user ${userId}`);
    return res.json();
  },

  fetchModsForVehicle: async (vehicleId) => {
    set({ modsLoading: true, modsError: null });
    try {
      const res = await fetch(endpoints.modsByVehicleId(vehicleId));
      if (!res.ok) throw new Error('Failed to load mods');
      const data = await res.json();
      set({ mods: data });
      return data;
    } catch (e) {
      set({ mods: [], modsError: e.message || 'Failed to load mods' });
      throw e;
    } finally {
      set({ modsLoading: false });
    }
  },

  // ---------------------------------------------------------------------------
  // Public profile flow
  // ---------------------------------------------------------------------------
  fetchPublicVehicleInfo: async (userIdOrUsername) => {
    set({ publicLoading: true, publicError: null });
    try {
      // If caller passes a numeric ID, endpoints.vehicleByUserId works directly.
      // If you want username resolution here, do it outside or add a helper.
      const vehicle = await get().fetchVehicleForUser(userIdOrUsername);
      set({ publicVehicleInfo: vehicle });

      if (vehicle?.id) {
        await get().fetchModsForVehicle(vehicle.id);
      } else {
        set({ mods: [] });
      }
      return vehicle;
    } catch (e) {
      set({
        publicVehicleInfo: null,
        publicError: e.message || 'Failed to load public profile',
        mods: [],
      });
      throw e;
    } finally {
      set({ publicLoading: false });
    }
  },

  // ---------------------------------------------------------------------------
  // App bootstrap (dashboard)
  //  - Loads user + vehicle (+mods) and then marks appReady = true
  //  - Does NOT toggle public/mods slice flags (prevents splash flicker)
  // ---------------------------------------------------------------------------
  hydrateAll: async () => {
    const { userId } = get();
    try {
      const [userProfile, vehicleInfo] = await Promise.all([
        get().fetchUserProfile(userId),
        get().fetchVehicleForUser(userId),
      ]);

      set({ userProfile, vehicleInfo });

      if (vehicleInfo?.id) {
        await get().fetchModsForVehicle(vehicleInfo.id);
      } else {
        set({ mods: [] });
      }
    } catch (e) {
      console.error('hydrateAll error:', e);
      // Let the app render; components can show friendly errors
      set({
        userProfile: null,
        vehicleInfo: null,
        mods: [],
      });
    } finally {
      set({ appReady: true });
    }
  },
}));

export default useAppStore;