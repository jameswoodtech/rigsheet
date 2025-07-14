import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMods } from '../data/fetchMods';
import '../styles/PublicProfile.css';

function PublicProfile() {
  const { userId } = useParams();
  const [mods, setMods] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState(null);

  useEffect(() => {
    // Fetch user vehicle info & mods (update fetchMods and add fetchVehicleInfo accordingly)
    import(`../data/${userId}/vehicleInfo.js`)
      .then((module) => setVehicleInfo(module.default))
      .catch((err) => {
            console.error('Error loading vehicleInfo:', err);
            setVehicleInfo(null);
            });

    fetchMods(userId).then(setMods);
  }, [userId]);

  if (!vehicleInfo) return <div>Loading profile...</div>;

  return (
    <div className="public-profile-container">
      <header className="public-profile-header">
        <h1>{vehicleInfo.owner}'s RigSheet</h1>
        <p>{vehicleInfo.tagline || 'Overlanding Enthusiast'}</p>
      </header>

      <section className="owner-vehicle-block">
        <img
          src={vehicleInfo.image}
          alt={`${vehicleInfo.owner}'s vehicle`}
          className="vehicle-image"
        />
        <div className="owner-info">
          <h2>{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h2>
          <p>{vehicleInfo.color}</p>
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

      {/* Optional sponsor highlight */}
      {mods.some((mod) => mod.sponsored) && (
        <section className="sponsor-highlight">
          This Rig includes sponsored gear from awesome partners!
        </section>
      )}
    </div>
  );
}

export default PublicProfile;
