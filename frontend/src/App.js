import React, { useState, useEffect } from 'react';
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
  const userId = 'user1';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // 2-second minimum load
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Build />} />
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
