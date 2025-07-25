import React, { useEffect } from 'react';
import ModList from '../components/ModList';
import VehicleInfo from '../components/VehicleInfo';
import useAppStore from '../store/useAppStore';

function Build() {
  const vehicleInfo = useAppStore((state) => state.vehicleInfo);
  const mods = useAppStore((state) => state.mods);
  const fetchMods = useAppStore((state) => state.fetchMods);

  useEffect(() => {
    if (vehicleInfo?.id) {
      fetchMods(vehicleInfo.id);
    }
  }, [vehicleInfo, fetchMods]);

  if (!vehicleInfo) {
    return <div className="loading">Loading your rig...</div>;
  }

  return (
    <div className="build-page">
      <VehicleInfo info={vehicleInfo} />
      <ModList mods={mods} />
    </div>
  );
}

export default Build;
