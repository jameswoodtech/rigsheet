// src/App.js
import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Build from './pages/Build';
import Sponsors from './pages/Sponsors';
import TrailLogs from './pages/TrailLogs';
import Printable from './pages/Printable';
import PublicProfile from './pages/PublicProfile';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';

import useAppStore from './store/useAppStore';

function AppInner() {
  const location     = useLocation();
  const pathname     = location.pathname || '/';
  const isPublicPage = pathname.startsWith('/login') || pathname.startsWith('/user/');

  // Sidebar state
  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const closeSidebar  = useAppStore((s) => s.closeSidebar);

  // App boot readiness from the store (set true at the end of hydrateAll)
  const appReady = useAppStore((s) => s.appReady);
  const initAuth = useAppStore((s) => s.initAuth);

  // Cosmetic minimum load time (for private shell only)
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

  // App bootstrap: restore auth → hydrate data once → enforce min splash duration
  useEffect(() => {
    const MIN_LOADING_TIME = 2000;
    const start = Date.now();
    let timer;

    (async () => {
      initAuth(); // restore token/user from localStorage

      // Hydrate dashboard data in the background. It won’t block public pages.
      await useAppStore.getState().hydrateAll();

      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
      timer = setTimeout(() => setMinLoad(false), remaining);
    })();

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show splash ONLY on private pages
  if (!isPublicPage && (!appReady || minLoad)) {
    return <LoadingScreen />;
  }

  // PUBLIC LAYOUT (no shell)
  if (isPublicPage) {
    const isLogin = pathname.startsWith('/login');
    return (
      <main className={`page-content ${isLogin ? 'page-content--flat' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/user/:userId" element={<PublicProfile />} />
          {/* safety: you can still expose these if you ever want */}
        </Routes>
      </main>
    );
  }

  // PRIVATE LAYOUT (full shell)
  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <div className="main-content">
        <Header onMenuClick={toggleSidebar} />
        <main className="page-content">
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Build />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/trail-logs" element={<TrailLogs />} />
              <Route path="/printable" element={<Printable />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}