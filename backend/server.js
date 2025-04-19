const express = require('express')
const axios = require('axios')
const cors = require('cors')
const moment = require('moment') // For date manipulation
const Arima = require('arima') // ARIMA library
const app = express()
const port = 3000

// Enable CORS
app.use(cors())
app.use(express.json())

// Logger middleware
function logger() {
    return (req, res, next) => {
        console.log(`${req.method} ${req.url} on localhost:${port}`)
        next()
    }
}
app.use(logger())

// Route to fetch earthquake data from USGS API
app.get('/earthquakes', async (req, res) => {
    const { starttime, endtime, minmagnitude, latitude, longitude, maxradiuskm, orderby } = req.query

    // Validate required parameters
    if (!starttime || !endtime || !minmagnitude || !latitude || !longitude || !maxradiuskm || !orderby) {
        return res.status(400).json({ error: 'starttime, endtime, minmagnitude, latitude, longitude, maxradiuskm, and orderby are required query parameters.' })
    }

    try {
        const usgsUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
        const params = {
            format: 'geojson',
            starttime,
            endtime,
            minmagnitude,
            latitude,
            longitude,
            maxradiuskm,
            orderby,
        }
        const response = await axios.get(usgsUrl, { params })

        // Limit the response to the first 30 rows
        const earthquakes = response.data.features.slice(0, 30)
        res.json(earthquakes)
    } catch (error) {
        console.error('Error fetching earthquake data:', error.message)
        res.status(500).json({ error: 'Failed to fetch earthquake data.' })
    }
})

// Route to predict earthquake magnitudes using ARIMA
app.post('/predict', async (req, res) => {
    const { earthquakeData } = req.body

    if (!earthquakeData || earthquakeData.length === 0) {
        return res.status(400).json({ error: 'Earthquake data is required for prediction.' })
    }

    try {
        // Extract magnitudes from earthquake data
        const magnitudes = earthquakeData.map((eq) => eq.properties.mag)

        // Train ARIMA model
        const arima = new Arima({ p: 2, d: 1, q: 2, verbose: false }).train(magnitudes)

        // Generate predictions for the next 5 years (60 months)
        const futureSteps = 12
        const [predictedValues, standardErrors] = arima.predict(futureSteps)

        res.json({
            predictions: predictedValues, // Predicted values
            confidenceIntervals: standardErrors, // Standard errors
            timeSeries: earthquakeData.map((eq) => ({
                date: new Date(eq.properties.time).toISOString().split('T')[0],
                magnitude: eq.properties.mag,
            })),
        })
    } catch (error) {
        console.error('Error predicting earthquake magnitudes:', error.message)
        res.status(500).json({ error: 'Failed to predict earthquake magnitudes.' })
    }
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})