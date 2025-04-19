import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Line, Bar, Scatter } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import './dashboard.css'
import axios from 'axios'
import Summary from './Summary.jsx'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)



function Heatmap({ earthquakeData }) {
    const map = useMap()

    useEffect(() => {
        // Create an array to store the bounds of all markers
        const bounds = []

        // Add circle markers for each earthquake
        const markers = earthquakeData.map((eq) => {
        const [longitude, latitude] = eq.geometry.coordinates
        const magnitude = eq.properties.mag

        // Add the coordinates to the bounds array
        bounds.push([latitude, longitude])

        return window.L.circleMarker([latitude, longitude], {
            radius: magnitude * 2, // Scale the circle size based on magnitude
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.6,
        }).bindPopup(
            `<strong>Magnitude:</strong> ${magnitude}<br><strong>Location:</strong> ${eq.properties.place || 'Unknown'}`
        )
        })

        // Add markers to the map
        markers.forEach((marker) => marker.addTo(map))

        // Adjust the map view to fit all markers
        if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] }) // Add padding for better visibility
        }

        // Cleanup function to remove markers when the component unmounts or updates
        return () => {
        markers.forEach((marker) => map.removeLayer(marker))
        }
    }, [map, earthquakeData])

    return null
}

function Dashboard() {
    const location = useLocation()
    const { earthquakes } = location.state || { earthquakes: [] }
    const [timeSeriesData, setTimeSeriesData] = useState([])
    const [predictions, setPredictions] = useState([])
    const [confidenceIntervals, setConfidenceIntervals] = useState([])
    // const [heatmapData, setHeatmapData] = useState([])
    const [loading, setLoading] = useState(true)

    // Data for new visualizations
    const [magnitudeDistribution, setMagnitudeDistribution] = useState({})
    const [scatterData, setScatterData] = useState({})
    const [correlationMatrix, setCorrelationMatrix] = useState([])
    const [timeOfDayData, setTimeOfDayData] = useState({})
    const [boxPlotData, setBoxPlotData] = useState({})

    useEffect(() => {
        const fetchPredictions = async () => {
        try {
            const response = await axios.post('http://localhost:3000/predict', { earthquakeData: earthquakes })
            const { timeSeries, predictions: predictedData, confidenceIntervals: ci } = response.data
            setTimeSeriesData(timeSeries)
            setPredictions(predictedData)
            setConfidenceIntervals(ci)
            console.log('Predictions:', predictedData)

            // const heatmapPoints = timeSeries.map((entry) => [
            // entry.latitude || 37.7749,
            // entry.longitude || -122.4194,
            // entry.magnitude,
            // ])
            // setHeatmapData(heatmapPoints)
        } catch (error) {
            console.error('Error fetching predictions:', error.message)
        } finally {
            setLoading(false)
        }
        }

        if (Array.isArray(earthquakes) && earthquakes.length > 0) {   
            fetchPredictions()
        }
    }, [earthquakes])

    useEffect(() => {
        const processData = () => {
        // Magnitude Distribution
        const magnitudeRanges = { '0-2': 0, '2-4': 0, '4-6': 0, '6-8': 0, '8+': 0 }
        earthquakes.forEach((eq) => {
            const mag = eq.properties.mag
            if (mag < 2) magnitudeRanges['0-2']++
            else if (mag < 4) magnitudeRanges['2-4']++
            else if (mag < 6) magnitudeRanges['4-6']++
            else if (mag < 8) magnitudeRanges['6-8']++
            else magnitudeRanges['8+']++
        })
        setMagnitudeDistribution(magnitudeRanges)

        // Magnitude vs Depth Scatter Plot
        const scatterPoints = earthquakes.map((eq) => ({
            x: eq.properties.mag,
            y: eq.geometry.coordinates[2], // Depth
        }))
        setScatterData(scatterPoints)

        // Correlation Matrix
        const magnitudes = earthquakes.map((eq) => eq.properties.mag)
        const depths = earthquakes.map((eq) => eq.geometry.coordinates[2])
        const latitudes = earthquakes.map((eq) => eq.geometry.coordinates[1])
        const longitudes = earthquakes.map((eq) => eq.geometry.coordinates[0])

        const calculateCorrelation = (arr1, arr2) => {
            const n = arr1.length
            const mean1 = arr1.reduce((a, b) => a + b, 0) / n
            const mean2 = arr2.reduce((a, b) => a + b, 0) / n
            const numerator = arr1.map((x, i) => (x - mean1) * (arr2[i] - mean2)).reduce((a, b) => a + b, 0)
            const denominator = Math.sqrt(
            arr1.map((x) => (x - mean1) ** 2).reduce((a, b) => a + b, 0) *
            arr2.map((x) => (x - mean2) ** 2).reduce((a, b) => a + b, 0)
            )
            return numerator / denominator
        }

        const matrix = [
            ['Magnitude', 'Depth', 'Latitude', 'Longitude'],
            ['Magnitude', 1, calculateCorrelation(magnitudes, depths), calculateCorrelation(magnitudes, latitudes), calculateCorrelation(magnitudes, longitudes)],
            ['Depth', calculateCorrelation(depths, magnitudes), 1, calculateCorrelation(depths, latitudes), calculateCorrelation(depths, longitudes)],
            ['Latitude', calculateCorrelation(latitudes, magnitudes), calculateCorrelation(latitudes, depths), 1, calculateCorrelation(latitudes, longitudes)],
            ['Longitude', calculateCorrelation(longitudes, magnitudes), calculateCorrelation(longitudes, depths), calculateCorrelation(longitudes, latitudes), 1],
        ]
        setCorrelationMatrix(matrix)

        // Earthquake Frequency by Time of Day
        const timeOfDayCounts = Array(24).fill(0)
        earthquakes.forEach((eq) => {
            const hour = new Date(eq.properties.time).getUTCHours()
            timeOfDayCounts[hour]++
        })
        setTimeOfDayData(timeOfDayCounts)

        // Magnitude Box Plot by Region
        const regions = {}
        earthquakes.forEach((eq) => {
            const lat = eq.geometry.coordinates[1]
            const region = lat < 0 ? 'Southern Hemisphere' : 'Northern Hemisphere'
            if (!regions[region]) regions[region] = []
            regions[region].push(eq.properties.mag)
        })
        setBoxPlotData(regions)
        }

        if (earthquakes.length > 0) {
        processData()
        }
    }, [earthquakes])

    // Chart.js data for time series visualization
    const timeSeriesChartData = {
        labels: timeSeriesData.map((entry) => entry.date),
        datasets: [
        {
            label: 'Earthquake Magnitudes',
            data: timeSeriesData.map((entry) => entry.magnitude),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        },
        ],
    }

    // Chart.js data for ARIMA predictions
    const predictionChartData = {
        labels: Array.from({ length: predictions.length }, (_, i) => `Month ${i + 1}`),
        datasets: [
        {
            label: 'Predicted Magnitudes (ARIMA)',
            data: predictions,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
        },
        {
            label: 'Confidence Intervals',
            data: confidenceIntervals,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
        },
        ],
    }

    // Bar Chart Data for Magnitude Distribution
    const magnitudeDistributionData = {
        labels: Object.keys(magnitudeDistribution),
        datasets: [
        {
            label: 'Earthquake Count',
            data: Object.values(magnitudeDistribution),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        ],
    }

    // Scatter Plot Data for Magnitude vs Depth
    const scatterPlotData = {
        datasets: [
        {
            label: 'Magnitude vs Depth',
            data: scatterData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
        ],
    }

    // Bar Chart Data for Earthquake Frequency by Time of Day
    const timeOfDayChartData = {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
        {
            label: 'Earthquake Count',
            data: timeOfDayData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
        ],
    }


    // Box Plot Data for Magnitude by Region
    const boxPlotChartData = {
        labels: Object.keys(boxPlotData),
        datasets: Object.keys(boxPlotData).map((region, index) => ({
        label: region,
        data: boxPlotData[region],
        backgroundColor: `rgba(${index * 50}, ${100 + index * 50}, 200, 0.6)`,
        borderColor: `rgba(${index * 50}, ${100 + index * 50}, 200, 1)`,
        borderWidth: 1,
        })),
    }




    return (
        <div className="dashboard-container">
        <h1 className="dashboard-title">Earthquake Dashboard</h1>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <div className="dashboard-flex">
            {/* Time Series Visualization */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">Time Series Visualization</h2>
                <div className="dashboard-item-content">
                <Line data={timeSeriesChartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
            <div className="dashboard-item">
                <Summary />

            </div>
            {/* ARIMA Predictions */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">ARIMA Predictions</h2>
                <div className="dashboard-item-content">
                <Line data={predictionChartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>

            {/* Magnitude Distribution Bar Chart */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">Magnitude Distribution</h2>
                <div className="dashboard-item-content">
                <Bar data={magnitudeDistributionData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>

            {/* Magnitude vs Depth Scatter Plot */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">Magnitude vs Depth</h2>
                <div className="dashboard-item-content">
                <Scatter data={scatterPlotData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>

            {/* Correlation Matrix */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">Correlation Matrix</h2>
                <div className="dashboard-item-content">
                <table className="correlation-matrix">
                    <thead>
                    <tr>
                        {correlationMatrix[0]?.map((header, index) => (
                        <th key={index}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {correlationMatrix.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <td key={colIndex}>{typeof value === 'number' ? value.toFixed(2) : value}</td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Earthquake Heatmap */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">Earthquake Heatmap</h2>
                <div className="dashboard-item-content">
                <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ height: '350px', width: '100%',marginBottom: '10px' }}>
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    />
                    <Heatmap earthquakeData={earthquakes} />
                </MapContainer>
                </div>
            </div>

            {/* Earthquake Frequency by Time of Day */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">Earthquake Frequency by Time of Day</h2>
                <div className="dashboard-item-content">
                <Bar data={timeOfDayChartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>

            {/* Magnitude Box Plot by Region */}
            <div className="dashboard-item">
                <h2 className="dashboard-item-title">Magnitude Box Plot by Region</h2>
                <div className="dashboard-item-content">
                <Bar data={boxPlotChartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
            </div>
        )}
        </div>
    )
}

export default Dashboard