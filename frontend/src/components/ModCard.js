import React from 'react';
import '../styles/ModCard.css';

function ModCard({ mod }) {
  if (!mod) return null;

  const {
    imageUrl,
    name,
    brand,
    category,
    weight,
    price,
    sponsored,
    reviewUrl,
  } = mod;

  return (
    <article className="mod-card" aria-label={`Modification: ${name}`}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${name} image`}
          className="mod-image"
          loading="lazy"
        />
      )}

      <h3 className="mod-name">{name || 'Unnamed Mod'}</h3>

      <ul className="mod-details">
        {brand && (
          <li>
            <strong>Brand:</strong> {brand}
          </li>
        )}
        {category && (
          <li>
            <strong>Category:</strong> {category}
          </li>
        )}
        {weight !== undefined && (
          <li>
            <strong>Weight:</strong> {weight}
          </li>
        )}
        <li>
          <strong>Price:</strong>{' '}
          {typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A'}
        </li>
      </ul>

      {sponsored && <span className="sponsored-badge">Sponsored</span>}

      {reviewUrl && (
        <p className="review-link">
          <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
            View Review
          </a>
        </p>
      )}
    </article>
  );
}

export default ModCard;
