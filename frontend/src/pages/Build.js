import React, { useEffect } from 'react';
import ModList from '../components/ModList';
import VehicleInfo from '../components/VehicleInfo';
import useAppStore from '../store/useAppStore';

/**
 * Dashboard for the logged-in user.
 * Shows the active vehicle and its modifications.
 */
function Build() {
  const vehicleInfo = useAppStore((s) => s.vehicleInfo);
  const mods        = useAppStore((s) => s.mods);
  const loading     = useAppStore((s) => s.loading);
  const error       = useAppStore((s) => s.error);

  useEffect(() => {
    if (vehicleInfo?.id) {
      // Call directly from store to avoid function identity in deps
      useAppStore.getState().fetchModsForVehicle(vehicleInfo.id)
        .catch(() => {/* store handles error */});
    }
  }, [vehicleInfo?.id]); // react only to vehicle changes

  if (loading || !vehicleInfo) return <div className="loading">Loading your rig…</div>;
  if (error) return <div className="error">Couldn’t load your rig. {error}</div>;

  return (
    <div className="build-page">
      <VehicleInfo info={vehicleInfo} />
      <ModList mods={mods || []} />
    </div>
  );
}

export default Build;