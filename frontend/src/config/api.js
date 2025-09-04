const DEFAULT_BASE = 'http://localhost:8081';
export const API_BASE =
  (process.env.REACT_APP_API_BASE || DEFAULT_BASE).replace(/\/$/, '');
export const endpoints = {
  userProfileById: (id) => `${API_BASE}/api/user-profiles/${id}`,
  vehicleByUserId: (userId) => `${API_BASE}/api/vehicles/user/${userId}`,
  modsByVehicleId: (vehicleId) => `${API_BASE}/api/mods/vehicle/${vehicleId}`,
};