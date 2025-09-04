import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PublicProfile.css';
import useAppStore from '../store/useAppStore';
import vehiclePlaceholder from '../assets/vehicle-placeholder.jpg';

/**
 * PublicProfile
 * - Works with /user/:userId where :userId can be either a numeric id OR a username.
 * - If username is provided, we first resolve it to a numeric user id using
 *   GET /api/user-profiles/username/{username}, then fetch vehicle + mods.
 * - Uses the centralized Zustand store; avoids effect loops by calling store
 *   methods via useAppStore.getState().
 */

function PublicProfile() {
  const { userId: userParam } = useParams();

  const publicVehicleInfo = useAppStore((s) => s.publicVehicleInfo);
  const mods              = useAppStore((s) => s.mods) || [];
  const loading           = useAppStore((s) => s.loading);
  const error             = useAppStore((s) => s.error);

  // Helper: is the param numeric?
  const isNumeric = (val) => /^\d+$/.test(String(val || '').trim());

  useEffect(() => {
    if (!userParam) return;

    const store = useAppStore.getState();

    (async () => {
      try {
        let resolvedUserId = userParam;

        // If route param is a username, resolve to numeric id first
        if (!isNumeric(userParam)) {
          const res = await fetch(`/api/user-profiles/username/${encodeURIComponent(userParam)}`);
          if (!res.ok) throw new Error('User not found');
          const profile = await res.json();
          resolvedUserId = profile?.id;
          if (!resolvedUserId) throw new Error('Invalid profile id');
        }

        // 1) Fetch vehicle for the resolved user id
        await store.fetchPublicVehicleInfo(resolvedUserId);

        // 2) Once we have a vehicle id, fetch mods
        const vid = useAppStore.getState().publicVehicleInfo?.id;
        if (vid) {
          await store.fetchModsForVehicle(vid);
        }
      } catch (e) {
        console.error('Failed to load public profile:', e);
        // store should capture error; if not, you can set a local error here
      }
    })();
  }, [userParam]);

  // Basic render states
  if (loading && !publicVehicleInfo) return <div className="public-loading">Loading profile…</div>;
  if (error && !publicVehicleInfo)   return <div className="public-error">Couldn’t load profile. {error}</div>;
  if (!publicVehicleInfo)            return <div className="public-empty">No profile found.</div>;

  const ownerName = publicVehicleInfo.userProfile?.displayName || 'Owner';
  const nickname  = publicVehicleInfo.nickname || 'Overlanding Enthusiast';
  const heroImage = publicVehicleInfo.imageUrl || vehiclePlaceholder;

  return (
    <div className="public-profile-container">
      <header className="public-profile-header">
        <h1>{ownerName}’s RigSheet</h1>
        <p>{nickname}</p>
      </header>

      <section className="owner-vehicle-block">
        <img
          src={heroImage}
          alt={`${ownerName}'s vehicle`}
          className="vehicle-image"
        />
        <div className="owner-info">
          <h2>
            {publicVehicleInfo.vehicleYear} {publicVehicleInfo.make} {publicVehicleInfo.model} {publicVehicleInfo.trim}
          </h2>
          <p>{publicVehicleInfo.color}</p>
          {publicVehicleInfo.userProfile?.location && (
            <p className="owner-location">{publicVehicleInfo.userProfile.location}</p>
          )}
        </div>
      </section>

      <section className="mod-list-section">
        <h3>Modifications &amp; Gear</h3>
        {mods.length === 0 ? (
          <p className="mods-empty">No mods added yet.</p>
        ) : (
          <ul className="public-mod-list">
            {mods.map((mod) => (
              <li key={mod.id} className="public-mod-item">
                <strong>{mod.name}</strong> — {mod.brand} ({mod.category})
                {mod.sponsored && <em className="sponsored-flag"> (Sponsored)</em>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {mods.some((m) => m.sponsored) && (
        <section className="sponsor-highlight">
          This rig includes sponsored gear from awesome partners!
        </section>
      )}
    </div>
  );
}

export default PublicProfile;