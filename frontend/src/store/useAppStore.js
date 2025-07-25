import { create } from 'zustand';

const useAppStore = create((set) => ({
  // --- Static or initial values ---
  userId: '1',

  // --- User & vehicle data ---
  userProfile: null,
  vehicleInfo: null,
  publicVehicleInfo: null,
  mods: [],

  // --- UI State ---
  isSidebarOpen: false,

  // --- Actions ---
  setUserProfile: (profile) => set({ userProfile: profile }),
  setVehicleInfo: (vehicle) => set({ vehicleInfo: vehicle }),
  setPublicVehicleInfo: (info) => set({ publicVehicleInfo: info }),
  setMods: (mods) => set({ mods }),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // --- Async actions ---
  fetchUserAndVehicleData: async () => {
    try {
      const [userRes, vehicleRes] = await Promise.all([
        fetch(`http://localhost:8080/api/user-profiles/1`),
        fetch(`http://localhost:8080/api/vehicles/user/1`)
      ]);

      const [userData, vehicleData] = await Promise.all([
        userRes.json(),
        vehicleRes.json()
      ]);

      set({
        userProfile: userData,
        vehicleInfo: vehicleData,
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  },

  fetchPublicVehicleInfo: async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/vehicles/user/${userId}`);
      const data = await res.json();
      set({ publicVehicleInfo: data });
    } catch (error) {
      console.error('Failed to fetch public vehicle info:', error);
      set({ publicVehicleInfo: null });
    }
  },

  fetchMods: async (vehicleId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/mods/vehicle/${vehicleId}`);
      const data = await res.json();
      set({ mods: data });
    } catch (error) {
      console.error('Failed to fetch mods:', error);
    }
  }
}));

export default useAppStore;
