// src/components/Header.js
import React from 'react';
//import './Header.css';

function Header({ userProfile }) {
  const displayName = userProfile?.displayName || '';

  return (
    <header className="header">
      <div className="app-title">RigSheet Dashboard</div>
      <div className="user-profile">
        Logged in as: {displayName}
      </div>
    </header>
  );
}

export default Header;
