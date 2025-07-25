import React from 'react';
import useAppStore from '../store/useAppStore';
import '../styles/ModList.css';
import ModCard from './ModCard';

function ModList({ mods: propsMods }) {
  const storeMods = useAppStore((state) => state.mods);
  const mods = propsMods || storeMods;

  if (!mods || mods.length === 0) {
    return <p>No modifications added yet.</p>;
  }

  return (
    <div className="mod-list-container">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} />
      ))}
    </div>
  );
}

export default ModList;
