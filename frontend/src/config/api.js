// src/config/api.js
import useAppStore from '../store/useAppStore';

const DEFAULT_BASE = 'http://localhost:8081';
export const API_BASE = (process.env.REACT_APP_API_BASE || DEFAULT_BASE).replace(/\/$/, '');

export const endpoints = {
  // --- auth ---
  login: () => `${API_BASE}/api/auth/login`,

  // --- public reads ---
  userProfileById: (id)        => `${API_BASE}/api/user-profiles/${id}`,
  vehicleByUserId: (userId)    => `${API_BASE}/api/vehicles/user/${userId}`,
  modsByVehicleId: (vehicleId) => `${API_BASE}/api/mods/vehicle/${vehicleId}`,

  // --- protected writes ---
  mods:       ()    => `${API_BASE}/api/mods`,
  modById:    (id)  => `${API_BASE}/api/mods/${id}`,
};

/** Internal helper: redirect to login + clear store */
function forceLogoutToLogin() {
  try { useAppStore.getState().logout(); } catch { /* no-op */ }
  // Hard redirect so any state is fully cleared
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

/**
 * Low-level fetch:
 *  - Adds Authorization header when token provided
 *  - Serializes JSON body (if provided)
 *  - Leaves response parsing to caller
 */
export async function apiFetch(url, { token, method = 'GET', body, headers, ...rest } = {}) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...rest,
  };
  return fetch(url, opts);
}

/** Safe JSON parse (handles empty 204 or invalid JSON gracefully) */
async function parseJsonSafe(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return { message: text }; }
}

/**
 * JSON wrapper:
 *  - Uses apiFetch
 *  - On 401 Unauthorized: auto-logout and redirect to /login
 *  - Throws Error with message + status on non-2xx
 */
export async function apiFetchJson(url, opts = {}) {
  const res = await apiFetch(url, opts);

  // Auto-logout on 401 (token expired/invalid)
  if (res.status === 401) {
    forceLogoutToLogin();
    const err = new Error('Your session has expired. Please sign in again.');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const data = await parseJsonSafe(res);
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return parseJsonSafe(res);
}