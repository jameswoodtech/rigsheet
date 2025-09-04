import React from 'react';
import '../styles/VehicleInfo.css';
import vehiclePlaceholder from '../assets/vehicle-placeholder.jpg'; // ✅ import placeholder image

/**
 * VehicleInfo component
 *
 * Displays detailed information about a vehicle, including year, make, model,
 * nickname, owner, and location. If no vehicle image is provided, a shared
 * placeholder graphic is displayed for consistency with other views.
 */
function VehicleInfo({ info }) {
  if (!info) return <p>Loading vehicle info...</p>;

  return (
    <section className="vehicle-info">
      <div className="vehicle-text">
        <h2 className="vehicle-title">
          {info.vehicleYear} {info.make} {info.model} {info.trim}
        </h2>
        <p>
          <strong>Color:</strong> <span>{info.color || 'N/A'}</span>
        </p>
        <p>
          <strong>Nickname:</strong>{' '}
          <span className="vehicle-nickname">{info.nickname || 'N/A'}</span>
        </p>
        <p>
          <strong>Owner:</strong>{' '}
          <span className="vehicle-owner">
            {info.userProfile?.displayName || 'Unknown'}
          </span>
        </p>
        <p>
          <strong>Location:</strong>{' '}
          <span>{info.userProfile?.location || 'Unknown'}</span>
        </p>
      </div>

      <div className="vehicle-image-container">
        <img
          src={info.image || vehiclePlaceholder}
          alt={`${info.nickname || info.model || 'Vehicle'} image`}
          className="vehicle-image"
        />
      </div>
    </section>
  );
}

export default VehicleInfo;