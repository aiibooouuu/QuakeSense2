import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import AboutUs from './AboutUs'
import quakeLogo from './assets/logo.png'

import axios from 'axios'
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material'
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Dashboard from './dashboard.jsx'
import Loader from './Loader.jsx'
function LocationPicker({ setLatitude, setLongitude }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      setLatitude(lat)
      setLongitude(lng)
    },
  })
  return null
}


function App() {
  const [starttime, setStarttime] = useState('')
  const [endtime, setEndtime] = useState('')
  const [minmagnitude, setMinmagnitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [maxradiuskm, setMaxradiuskm] = useState(1000)
  const [orderby, setOrderby] = useState('time')
  const [earthquakes, setEarthquakes] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchEarthquakes = async () => {
    setLoading(true)
    setFetched(false)
    try {
      const response = await axios.get('http://localhost:3000/earthquakes', {
        params: { starttime, endtime, minmagnitude, latitude, longitude, maxradiuskm, orderby },
      })
      setEarthquakes(response.data)
    } catch (error) {
      console.error('Error fetching earthquake data:', error.message)
      setEarthquakes([])
    } finally {
      setLoading(false)
      setFetched(true)
    }
  }

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:3000/earthquakes');
  //     const { starttime, endtime, minmagnitude, latitude, longitude, maxradiuskm, orderby } = response.data; // Example structure
  //     setStarttime(starttime);
  //     setEndtime(endtime);
  //     setMinmagnitude(minmagnitude);
  //     setLatitude(latitude);
  //     setLongitude(longitude);
  //     setMaxradiuskm(maxradiuskm);
  //     setOrderby(orderby);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500) // loader duration in ms
    
    return () => clearTimeout(timer)
  }
  , [])
  if (isLoading) {
      return (
        <Loader />
      )
    }

  return (
    <Router>
      <>
        <nav className="navbar">
          <div className="navbar-logo">
            <img src={quakeLogo} alt="Quake Sense Logo" className="logo" />
            <h1>QUAKE SENSE</h1>
          </div>
          <div className="navbar-links">
            <Link to="/">Home</Link>
            {/* <Link to="/dashboard">Dashboard</Link> */}
            <Link to="/about">About Us</Link>
          </div>
        </nav>

  
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-container">
                <div className="form-section">
                  <Container maxWidth="md" sx={{ padding: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      Earthquake Data Fetcher
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4 }}>
                      {/* Form Inputs */}
                      <TextField
                        label="Start Time"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={starttime}
                        onChange={(e) => setStarttime(e.target.value)}
                      />
                      <TextField
                        label="End Time"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endtime}
                        onChange={(e) => setEndtime(e.target.value)}
                      />
                      <TextField
                        label="Min Magnitude"
                        type="number"
                        value={minmagnitude}
                        onChange={(e) => setMinmagnitude(e.target.value)}
                      />
                      <TextField
                        label="Max Radius (km)"
                        type="number"
                        value={maxradiuskm}
                        onChange={(e) => setMaxradiuskm(e.target.value)}
                      />
                      <TextField
                        label="Order By"
                        type="text"
                        value={orderby}
                        onChange={(e) => setOrderby(e.target.value)}
                        helperText="Options: time, magnitude"
                      />
                      <Typography variant="body1">
                        Selected Latitude: {latitude || 'Not selected'}
                      </Typography>
                      <Typography variant="body1">
                        Selected Longitude: {longitude || 'Not selected'}
                      </Typography>
  
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchEarthquakes}
                        disabled={loading}
                      >
                        {loading ? 'Fetching...' : 'Fetch Earthquakes'}
                      </Button>
                    </Box>
                  </Container>
                </div>
  
                <div className="map-section">
                  <MapContainer
                    center={[28.3949, 84.124]}
                    zoom={6}
                    style={{ height: '300px', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <LocationPicker setLatitude={setLatitude} setLongitude={setLongitude} />
                    {latitude && longitude && (
                      <>
                        <Marker position={[latitude, longitude]} />
                        <Circle
                          center={[latitude, longitude]}
                          radius={maxradiuskm * 1000}
                          pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                        />
                      </>
                    )}
                  </MapContainer>
                </div>
  
                <div className="output-section">
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                      <CircularProgress />
                    </Box>
                  ) : earthquakes.length > 0 ? (
                    <>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Magnitude</strong></TableCell>
                              <TableCell><strong>Place</strong></TableCell>
                              <TableCell><strong>Time</strong></TableCell>
                              <TableCell><strong>Details</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {earthquakes.map((eq, index) => (
                              <TableRow key={index}>
                                <TableCell>{eq.properties.mag}</TableCell>
                                <TableCell>{eq.properties.place}</TableCell>
                                <TableCell>{new Date(eq.properties.time).toLocaleString()}</TableCell>
                                <TableCell>
                                  <a href={eq.properties.url} target="_blank" rel="noopener noreferrer">
                                    More Info
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box mt={4} display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/dashboard"
                        state={{
                          earthquakes,
                          starttime,
                          endtime,
                          minmagnitude,
                          latitude,
                          longitude,
                          maxradiuskm,
                          orderby
                        }}
                      >
                        Go to Dashboard
                      </Button>

                      </Box>
                    </>
                  ) : fetched ? (
                    <Typography variant="body1" align="center" mt={4}>
                      No earthquake data matched your search criteria. Please adjust your filters and try again.
                    </Typography>
                  ) : null}
                </div>
              </div>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </>
    </Router>
  )
  
}

export default App
