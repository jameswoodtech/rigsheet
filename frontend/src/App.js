import React, { useEffect, useState } from 'react';
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

import useAppStore from './store/useAppStore';

function App() {
  const {
    userId,
    userProfile,
    vehicleInfo,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    fetchUserAndVehicleData
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);

  // Disable body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
  }, [isSidebarOpen]);

  // Close sidebar on Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSidebar]);

  useEffect(() => {
    const MIN_LOADING_TIME = 2000;
    const startTime = Date.now();

    const load = async () => {
      await fetchUserAndVehicleData();
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
      setTimeout(() => setIsLoading(false), delay);
    };

    load();
  }, [fetchUserAndVehicleData]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
        <div className="main-content">
          <Header />
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
