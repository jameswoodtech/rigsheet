import React from 'react';
import '../styles/ModCard.css';

function ModCard({ mod }) {
  return (
    <div className="mod-card">
      <img src={mod.imageUrl} alt={mod.name} className="mod-image" />
      <h3>{mod.name}</h3>
      <p><strong>Brand:</strong> {mod.brand}</p>
      <p><strong>Category:</strong> {mod.category}</p>
      <p><strong>Weight:</strong> {mod.weight}</p>
      <p><strong>Price:</strong> {typeof mod.price === 'number' ? `$${mod.price.toFixed(2)}` : 'N/A'}</p>
      {mod.sponsored && <span className="sponsored-badge">Sponsored</span>}
      {mod.reviewUrl && (
        <p>
          <a href={mod.reviewUrl} target="_blank" rel="noopener noreferrer">View Review</a>
        </p>
      )}
    </div>
  );
}

export default ModCard;
