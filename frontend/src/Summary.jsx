import React from 'react';
import { useLocation } from 'react-router-dom';
import './Summary.css'; // Import your CSS file for styling
const Summary = () => {
    const location = useLocation();
    const {
        starttime,
        endtime,
        minmagnitude,
        latitude,
        longitude,
        maxradiuskm,
        orderby,
        } = location.state || {};
        
    return (
    <div className="summary-box">
    <h3 className="summary-title">Summary of Selected Parameters</h3>
    <div className="param-row">
        <strong>Start Time:</strong>
        <span>{starttime ? new Date(starttime).toLocaleString() : 'Not selected'}</span>
    </div>
    <div className="param-row">
        <strong>End Time:</strong>
        <span>{endtime ? new Date(endtime).toLocaleString() : 'Not selected'}</span>
    </div>
    <div className="param-row">
        <strong>Min Magnitude:</strong>
        <span>{minmagnitude || 'Not specified'}</span>
    </div>
    <div className="param-row">
        <strong>Location (Lat, Long):</strong>
        <span>{latitude ? `${latitude}, ${longitude}` : 'Not specified'}</span>
    </div>
    <div className="param-row">
        <strong>Max Radius (km):</strong>
        <span>{maxradiuskm || 'Not specified'}</span>
    </div>
    <div className="param-row">
        <strong>Order By:</strong>
        <span>{orderby || 'Not selected'}</span>
    </div>
    </div>
);
};

export default Summary;
