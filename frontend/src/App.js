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
  // Sidebar state
  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const closeSidebar  = useAppStore((s) => s.closeSidebar);

  // App boot readiness from the store (set true at the end of hydrateAll)
  const appReady = useAppStore((s) => s.appReady);

  // Cosmetic minimum load time (so the splash doesn’t flash)
  const [minLoad, setMinLoad] = useState(true);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
  }, [isSidebarOpen]);

  // Close sidebar on Esc
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeSidebar(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeSidebar]);

  // App bootstrap: hydrate data once and enforce a minimum splash duration
  useEffect(() => {
    const MIN_LOADING_TIME = 2000;
    const start = Date.now();
    let timer;

    (async () => {
      await useAppStore.getState().hydrateAll(); // sets appReady=true when done
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
      timer = setTimeout(() => setMinLoad(false), remaining);
    })();

    return () => clearTimeout(timer);
  }, []);

  // Show splash until BOTH: appReady AND minLoad window are satisfied
  if (!appReady || minLoad) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

        <div className="main-content">
          <Header onMenuClick={toggleSidebar} />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Build />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/trail-logs" element={<TrailLogs />} />
              <Route path="/printable" element={<Printable />} />
              <Route path="/user/:userId" element={<PublicProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;