import React from 'react';
import '../styles/VehicleInfo.css';

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
          <span className="vehicle-owner">{info.userProfile?.displayName || 'Unknown'}</span>
        </p>
        <p>
          <strong>Location:</strong> <span>{info.userProfile?.location || 'Unknown'}</span>
        </p>
      </div>
      {info.image ? (
        <div className="vehicle-image-container">
          <img
            src={info.image}
            alt={`${info.nickname || info.model} vehicle`}
            className="vehicle-image"
          />
        </div>
      ) : (
        <div className="vehicle-image-placeholder">No Image Available</div>
      )}
    </section>
  );
}

export default VehicleInfo;
