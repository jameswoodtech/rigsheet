// src/components/SponsorBlock.js
import React from 'react';
import '../styles/PublicProfile.css'; // assuming you're using the CSS we defined

const sponsors = [
  { name: 'TrailArmor', logo: '/assets/sponsors/trailarmor.png' },
  { name: 'OffGrid', logo: '/assets/sponsors/offgrid.png' },
  { name: 'RoughRiders', logo: '/assets/sponsors/roughriders.png' },
];

function SponsorBlock() {
  return (
    <div className="sponsor-block">
      {sponsors.map((sponsor) => (
        <img
          key={sponsor.name}
          src={sponsor.logo}
          alt={sponsor.name}
          className="sponsor-logo"
        />
      ))}
    </div>
  );
}

export default SponsorBlock;
