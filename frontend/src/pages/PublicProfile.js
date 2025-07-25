import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PublicProfile.css';
import useAppStore from '../store/useAppStore';

function PublicProfile() {
  const { userId } = useParams();
  const {
    publicVehicleInfo,
    mods,
    fetchPublicVehicleInfo,
    fetchMods,
  } = useAppStore();

  useEffect(() => {
    if (userId) {
      fetchPublicVehicleInfo(userId);
    }
  }, [userId, fetchPublicVehicleInfo]);

  useEffect(() => {
    if (publicVehicleInfo?.id) {
      fetchMods(publicVehicleInfo.id);
    }
  }, [publicVehicleInfo, fetchMods]);

  if (!publicVehicleInfo) return <div>Loading profile...</div>;

  return (
    <div className="public-profile-container">
      <header className="public-profile-header">
        <h1>{publicVehicleInfo.userProfile?.displayName}'s RigSheet</h1>
        <p>{publicVehicleInfo.nickname || 'Overlanding Enthusiast'}</p>
      </header>

      <section className="owner-vehicle-block">
        <img
          src={publicVehicleInfo.imageUrl}
          alt={`${publicVehicleInfo.userProfile?.displayName}'s vehicle`}
          className="vehicle-image"
        />
        <div className="owner-info">
          <h2>{publicVehicleInfo.vehicleYear} {publicVehicleInfo.make} {publicVehicleInfo.model} {publicVehicleInfo.trim}</h2>
          <p>{publicVehicleInfo.color}</p>
        </div>
      </section>

      <section className="mod-list-section">
        <h3>Modifications & Gear</h3>
        {mods.length === 0 ? (
          <p>No mods added yet.</p>
        ) : (
          <ul>
            {mods.map((mod) => (
              <li key={mod.id}>
                <strong>{mod.name}</strong> — {mod.brand} ({mod.category}){' '}
                {mod.sponsored && <em>(Sponsored)</em>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {mods.some((mod) => mod.sponsored) && (
        <section className="sponsor-highlight">
          This Rig includes sponsored gear from awesome partners!
        </section>
      )}
    </div>
  );
}

export default PublicProfile;
