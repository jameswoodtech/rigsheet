import React, { useState, useEffect } from 'react';
import '../styles/LoadingScreen.css';

const messages = [
  "Packing your gear...",
  "Checking the trails...",
  "Gearing up your rig...",
  "Fueling the adventure...",
  "Loading mods & sponsors...",
  "Mapping the route...",
  "Tightening the bolts...",
  "Almost ready to roll..."
];

function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500); // every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <img
        src="/assets/rigsheet-logo-dark.png"
        alt="RigSheet Logo"
        className="loading-logo"
      />
      <div className="spinner" />
      <p className="loading-message">{messages[index]}</p>
    </div>
  );
}

export default LoadingScreen;

