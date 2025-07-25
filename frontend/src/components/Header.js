import React from 'react';
import '../styles/Header.css';
import { Menu } from 'lucide-react';

function Header({ userProfile, onToggleSidebar }) {
  const displayName = userProfile?.displayName || '';

  return (
    <header className="header">
      {/* Mobile menu button */}
      <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Open Sidebar">
        <Menu size={24} />
      </button>

      <div className="app-title">RigSheet Dashboard</div>
      <div className="user-profile">
        Logged in as: {displayName}
      </div>
    </header>
  );
}

export default Header;
