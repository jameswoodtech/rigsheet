import React from 'react';
import '../styles/ModList.css';
import ModCard from './ModCard';

function ModList({ mods }) {
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