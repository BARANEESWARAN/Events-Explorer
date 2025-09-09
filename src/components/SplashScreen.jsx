import React from 'react';
import '../styles/SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo">
          <i className="fas fa-ticket-alt"></i>
          <h1>City Pulse</h1>
        </div>
        <p>Discover Local Events</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default SplashScreen;