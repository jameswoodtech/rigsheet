import React, { useState, useEffect, useCallback } from 'react';
import './styles/App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Build from './pages/Build';
import Sponsors from './pages/Sponsors';
import TrailLogs from './pages/TrailLogs';
import Printable from './pages/Printable';
import PublicProfile from './pages/PublicProfile';

function App() {
  const userId = '1';

  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
  }, [isSidebarOpen]);

  // Handle Esc key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    const MIN_LOADING_TIME = 2000;

    const fetchData = async () => {
      const startTime = Date.now();

      try {
        const [userRes, vehicleRes] = await Promise.all([
          fetch(`http://localhost:8080/api/user-profiles/${userId}`),
          fetch(`http://localhost:8080/api/vehicles/user/${userId}`)
        ]);

        const [userData, vehicleData] = await Promise.all([
          userRes.json(),
          vehicleRes.json()
        ]);

        setUserProfile(userData);
        setVehicleInfo(vehicleData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
        setTimeout(() => setIsLoading(false), delay);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
        <div className="main-content">
          <Header userProfile={userProfile} onToggleSidebar={toggleSidebar} />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Build userProfile={userProfile} vehicleInfo={vehicleInfo} />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/trail-logs" element={<TrailLogs />} />
              <Route path="/printable" element={<Printable userId={userId} />} />
              <Route path="/user/:userId" element={<PublicProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
