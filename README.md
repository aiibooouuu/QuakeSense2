# 🌍 QuakeSense2 — Real-Time Earthquake Data Visualization & Analytics

QuakeSense2 is an interactive web dashboard that fetches, visualizes, and analyzes real-time seismic data using the [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/). Built using React.js, Leaflet.js, and Chart.js, it allows users to explore earthquakes around the world filtered by **date range**, **radius**, **magnitude**, and more.

---

## 🚀 Features

- 📅 **Custom Date Range Input** — Select start and end time (`dd/mm/yyyy`) for earthquake filtering.
- 📍 **Location-Based Filtering** — Click on any point on an interactive map to set an epicenter.
- 📏 **Radius Selection** — Choose a radius in km² around the selected point to filter events.
- 📊 **Sorting Options** — Sort earthquakes by **time** or **magnitude**.
- 📋 **List View** — See a tabular list of earthquakes including location, magnitude, depth, and time.
- 📈 **Dashboard** — Navigate to see interactive data visualizations such as:
  - Line Charts (Time vs Magnitude)
  - Bar Charts (Frequency by Day)
  - Scatter Plots (Magnitude vs Depth)
  - Box Charts (Magnitude by Hemisphere)
  - Heatmaps (Intensity Zones)
  - Prediction Trends (JS-based linear forecasts)

---

## 🧠 Tech Stack

| Layer        | Technology               | Badges |
|--------------|--------------------------|--------|
| Frontend     | React.js, JavaScript     | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
| Visualization| Chart.js (react-chartjs-2) | ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white) |
| Maps         | Leaflet.js                | ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white) |
| API Source   | [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/) | – |



---

## 🛠️ Project Architecture

1. **User Input**:
   - Date Range (Start + End in `dd/mm/yyyy`)
   - Radius in km²
   - Sorting Preference (Time or Magnitude)
   - Location via Leaflet map click

2. **Data Fetching**:
   - Fetches GeoJSON from USGS API based on user input.

3. **Display**:
   - Lists earthquakes in a user-friendly format.
   - Option to proceed to Dashboard.

4. **Dashboard**:
   - Visualizes data through various Chart.js components.

---

## 📦 Folder Structure

```bash
QuakeSense2/
├── backend/              # Future backend (optional)
├── frontend/             # Main React frontend
│   ├── components/
│   ├── pages/
│   ├── App.js
│   └── ...
├── public/
├── vercel.json
└── README.md
```
## 🔮 Future Enhancements

- 🧠 **Machine Learning** — Integrate basic ML models for seismic trend prediction based on historical and real-time data.
- 💾 **Offline Support** — Implement offline caching of previously fetched earthquake data for uninterrupted access.
- 🚨 **Notifications** — Enable real-time alerts and browser notifications based on user-defined thresholds (e.g., magnitude, proximity).
- 📱 **Mobile Optimization** — Enhance responsiveness and UX for smaller screens to ensure smooth performance on mobile devices.

---

---

## 👨‍💻 Authors

> - ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) – [**Hamza**](https://github.com/aiibooouuu) <br />
> - ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) - [**Andre**](https://github.com/PippyUrkel)


---

## 📄 License

This project is open-source and available under the **MIT License**.
