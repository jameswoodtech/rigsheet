import React from 'react';
import '../styles/Header.css';
import { Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

function Header() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      {/* Mobile menu button */}
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Open Sidebar">
        <Menu size={24} />
      </button>

      <div className="app-title">RigSheet Dashboard</div>

      <div className="user-profile">
        {currentUser ? (
          <>
            <span className="user-display">Hello, {currentUser.displayName || currentUser.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;