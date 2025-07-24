import React from 'react';
import '../styles/VehicleInfo.css';

function VehicleInfo({ info }) {
  return (
    <div className="vehicle-info">
      <div className="vehicle-text">
        <h2>{info.vehicleYear}  {info.make} {info.model} {info.trim}</h2>
        <p><strong>Color:</strong> {info.color}</p>
        <p><strong>Nickname:</strong> {info.nickname}</p>
        <p><strong>Owner:</strong> {info.userProfile.displayName}</p>
        <p><strong>Location:</strong> {info.userProfile.location}</p>
      </div>
      {info.image && (
        <div className="vehicle-image-container">
          <img src={info.image} alt={`${info.model}`} className="vehicle-image" />
        </div>
      )}
    </div>
  );
}

export default VehicleInfo;

