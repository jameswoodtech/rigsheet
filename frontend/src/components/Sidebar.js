import React from 'react';
import '../styles/Sidebar.css';
import { Wrench, Star, MapPin, Printer, UserCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import logo from '../assets/rigsheet-logo-dark.png';


function Sidebar() {
  const isOpen = useAppStore((state) => state.isSidebarOpen);
  const closeSidebar = useAppStore((state) => state.closeSidebar);
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-container">
        <img
          src={logo}
          alt="RigSheet Logo"
          className="sidebar-logo"
        />
      </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined} onClick={closeSidebar}>
              <Wrench size={18} />
              <span>Build</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sponsors" className={({ isActive }) => isActive ? 'active' : undefined} onClick={closeSidebar}>
              <Star size={18} />
              <span>Sponsors</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/trail-logs" className={({ isActive }) => isActive ? 'active' : undefined} onClick={closeSidebar}>
              <MapPin size={18} />
              <span>Trail Logs</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/printable" className={({ isActive }) => isActive ? 'active' : undefined} onClick={closeSidebar}>
              <Printer size={18} />
              <span>Printable</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/user/1" onClick={closeSidebar}>
              <UserCircle size={18} /> Public Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
