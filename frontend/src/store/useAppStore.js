// src/store/useAppStore.js
import { create } from 'zustand';
import { endpoints, apiFetchJson } from '../config/api';

/**
 * Global application state with:
 * - Auth: token/currentUser + initAuth/login/logout (localStorage persistence)
 * - Data hydration: hydrateAll() -> userProfile, vehicleInfo, mods
 * - Public profile flow (+ slice-level loading flags)
 * - Protected writes (create/update/delete Mod) with Authorization
 *
 * Notes:
 * - All network calls go through apiFetchJson for consistent JSON + error handling
 * - hydrateAll prefers logged-in user id; falls back to legacy userId for dev
 */
const useAppStore = create((set, get) => ({
  // ---------------------------------------------------------------------------
  // Session / static
  // ---------------------------------------------------------------------------
  /** Legacy default user id for dev; real sessions use currentUser.id */
  userId: '1',

  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------
  token: null,          // JWT (or other bearer)
  currentUser: null,    // { id, username, displayName, roles? }

  /** Restore token/user from localStorage on app start */
  initAuth: () => {
    try {
      const raw = localStorage.getItem('rigsheet_auth');
      if (!raw) return;
      const { token, user } = JSON.parse(raw);
      if (token && user) {
        set({ token, currentUser: user, userId: String(user.id ?? '1') });
      }
    } catch {
      /* ignore parse errors */
    }
  },

  /**
   * POST /api/auth/login → { token, user }
   * Persists token+user and updates store.
   */
  login: async (username, password) => {
    const { token, user } = await apiFetchJson(endpoints.login(), {
      method: 'POST',
      body: { username, password },
    });

    localStorage.setItem('rigsheet_auth', JSON.stringify({ token, user }));
    set({ token, currentUser: user, userId: String(user.id ?? '1') });

    return user;
  },

  /** Clears token/user and local data */
logout: () => {
  localStorage.removeItem('rigsheet_auth');
  // clear store state as you already do:
  // set({ token: null, currentUser: null, ... });
  set({ token: null, currentUser: null, userProfile: null, vehicleInfo: null, publicVehicleInfo: null, mods: [] });
  // hard redirect to login for a clean slate
  window.location.assign('/login');
},

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

  /** Global “app is ready” flag (used by App.js splash) */
  appReady: false,
  setAppReady: (v) => set({ appReady: v }),

  /** Slice-level loaders/errors (don’t drive the global splash) */
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
  // Local setters (rarely used externally)
  // ---------------------------------------------------------------------------
  setUserProfile: (userProfile) => set({ userProfile }),
  setVehicleInfo: (vehicleInfo) => set({ vehicleInfo }),
  setPublicVehicleInfo: (publicVehicleInfo) => set({ publicVehicleInfo }),
  setMods: (mods) => set({ mods }),

  // ---------------------------------------------------------------------------
  // Low-level reads (auth-aware)
  // ---------------------------------------------------------------------------
  fetchUserProfile: async (id) => {
    const token = get().token;
    return apiFetchJson(endpoints.userProfileById(id), { token });
  },

  fetchVehicleForUser: async (uid) => {
    const token = get().token;
    return apiFetchJson(endpoints.vehicleByUserId(uid), { token });
  },

  fetchModsForVehicle: async (vehicleId) => {
    const token = get().token;
    set({ modsLoading: true, modsError: null });
    try {
      const data = await apiFetchJson(endpoints.modsByVehicleId(vehicleId), { token });
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
  // Protected writes (examples)
  // ---------------------------------------------------------------------------
  createMod: async (mod) => {
    const token = get().token;
    return apiFetchJson(endpoints.mods(), {
      method: 'POST',
      token,
      body: mod, // { vehicleInfo: { id }, name, brand, ... }
    });
  },

  updateMod: async (id, mod) => {
    const token = get().token;
    return apiFetchJson(endpoints.modById(id), {
      method: 'PUT',
      token,
      body: mod,
    });
  },

  deleteMod: async (id) => {
    const token = get().token;
    await apiFetchJson(endpoints.modById(id), {
      method: 'DELETE',
      token,
    });
  },

  // ---------------------------------------------------------------------------
  // Public profile flow
  // ---------------------------------------------------------------------------
  fetchPublicVehicleInfo: async (userIdOrUsername) => {
    set({ publicLoading: true, publicError: null });
    try {
      // If you later support usernames, resolve them before this call.
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
  // ---------------------------------------------------------------------------
  hydrateAll: async () => {
    // Prefer authenticated user id if present
    const activeUserId = get().currentUser?.id ?? get().userId;

    try {
      const [userProfile, vehicleInfo] = await Promise.all([
        get().fetchUserProfile(activeUserId),
        get().fetchVehicleForUser(activeUserId),
      ]);

      set({ userProfile, vehicleInfo });

      if (vehicleInfo?.id) {
        await get().fetchModsForVehicle(vehicleInfo.id);
      } else {
        set({ mods: [] });
      }
    } catch (e) {
      console.error('hydrateAll error:', e);
      set({ userProfile: null, vehicleInfo: null, mods: [] });
    } finally {
      set({ appReady: true });
    }
  },
}));

export default useAppStore;