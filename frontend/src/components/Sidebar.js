import React from 'react';
import '../styles/Sidebar.css';
import { Wrench, Star, MapPin, Printer } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
  <div className="logo-container">
    <img src="/assets/rigsheet-logo-dark.png" alt="RigSheet Logo" className="sidebar-logo" />
  </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>
              <Wrench size={18} />
              <span>Build</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sponsors" className={({ isActive }) => isActive ? 'active' : undefined}>
              <Star size={18} />
              <span>Sponsors</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/trail-logs" className={({ isActive }) => isActive ? 'active' : undefined}>
              <MapPin size={18} />
              <span>Trail Logs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/printable" className={({ isActive }) => isActive ? 'active' : undefined}>
              <Printer size={18} />
              <span>Printable</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
