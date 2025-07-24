import React, {useEffect, useState } from 'react';
import ModList from '../components/ModList';
import VehicleInfo from '../components/VehicleInfo';
import vehicleInfo from '../data/user1/vehicleInfo';

function Build() {
  const userId = 1; // Or 'user1' if you're mapping usernames to IDs
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [mods, setMods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Step 1: Fetch the vehicle info
    const fetchVehicleInfo = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/vehicles/user/${userId}`); // Adjust user ID as needed
        const data = await res.json();
        setVehicleInfo(data);

        // Step 2: Fetch modifications for the vehicle
        const modRes = await fetch(`http://localhost:8080/api/mods/vehicle/${data.id}`);
        const modsData = await modRes.json();
        setMods(modsData);
      } catch (err) {
        console.error('Error fetching vehicle or mods:', err);
      }
    };

    fetchVehicleInfo();
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading your rig...</div>;

  return (
    <div className="build-page">
      {vehicleInfo && <VehicleInfo info={vehicleInfo} />}
      <ModList mods={mods} />
    </div>
  );
}

export default Build;