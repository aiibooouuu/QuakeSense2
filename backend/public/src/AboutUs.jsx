import React from 'react'
import './AboutUs.css'
import { Container, Typography, Box } from '@mui/material'

const AboutUs = () => {
return (
    <Container maxWidth="md" className="about-container">
    <Typography variant="h4" gutterBottom>
        About Quake Sense
    </Typography>
    <Typography variant="body1" paragraph>
        Quake Sense is an intelligent and responsive earthquake data visualization tool created for both educational and practical purposes. It allows users to fetch, view, and analyze real-time earthquake data using geographic filters and magnitude thresholds. Built with modern front-end tools and data fetching capabilities, it provides an intuitive interface to understand seismic activity across various locations.
    </Typography>

    <Typography variant="h5" gutterBottom>
        How We Built It
    </Typography>
    <Typography variant="body1" paragraph>
        Quake Sense utilizes the USGS (United States Geological Survey) Earthquake API to retrieve the latest seismic event information based on user-input parameters like start and end date, magnitude, radius, and geolocation. We’ve used Leaflet for interactive map visualization, allowing users to select a point on the map and view earthquakes in a surrounding radius. The dashboard provides detailed tabular results with magnitude, location, and timestamps. We also include advanced features such as dynamic radius mapping with circular overlays and deep linking to USGS event pages. The system is built using React, MUI, Axios, and React Router DOM to ensure smooth navigation and modern UI/UX standards.
    </Typography>

    <Box className="footer">
        <Typography variant="body1" align="center">
        Developed by <strong>Andre Dsouza</strong>, <strong>Alroy Lopez</strong>, and <strong>AbuHamza AbuZafar</strong><br />
        A Product of <strong>2025</strong> ©
        </Typography>
        <Typography variant="body2" align="center" mt={1}>
        Inspired by <strong>DAV</strong> and built under the guidance of <strong>Prof. Jagruti Save</strong>.
        </Typography>
    </Box>
    </Container>
)
}

export default AboutUs
