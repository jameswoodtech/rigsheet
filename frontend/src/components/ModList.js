import { fetchMods } from '../data/fetchMods';
import React, { useState, useEffect } from 'react';
import '../styles/ModList.css';
import ModCard from './ModCard';

function ModList() {
  const [mods, setMods] = useState([]);

  useEffect(() => {
    fetchMods('user1').then(setMods);
  })

  return (
    <div className="mod-list-container">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} />
      ))}
    </div>
  );
}

export default ModList;