import React from 'react';
import '../styles/Header.css';
import { Menu } from 'lucide-react';
import useAppStore from '../store/useAppStore';

function Header({ userProfile, onToggleSidebar }) {
  const userProf = useAppStore((state) => state.userProfile);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  const displayName = userProf?.displayName || '';

  return (
    <header className="header">
      {/* Mobile menu button */}
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Open Sidebar">
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
