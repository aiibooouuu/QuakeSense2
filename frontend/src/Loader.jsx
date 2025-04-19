import React from 'react';
import './Loader.css'; // Import the CSS file for styling
import MatrixBackground from './MatrixBackground.jsx'; // Adjust path as needed

const Loader = () => {
  return (
    <div className="full-screen-wrapper">
      <MatrixBackground />
      <div className="styled-wrapper">
        <div className="loader">
          <span />
        </div>
        <h1 className="typewriter">QuakeSense</h1>
      </div>
    </div>
  );
};

export default Loader;
