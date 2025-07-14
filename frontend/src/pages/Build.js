import React from 'react';
import ModList from '../components/ModList';
import VehicleInfo from '../components/VehicleInfo';
import vehicleInfo from '../data/user1/vehicleInfo';

function Build() {


  return (
    <div className="build-page">
        <VehicleInfo info={vehicleInfo} />
        <ModList />
    </div>
  );
}

export default Build;