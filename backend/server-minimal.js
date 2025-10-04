const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting minimal server...');

// Basic middleware
app.use(cors());
app.use(express.json());

// In-memory data store
const maharashtraCities = [
  {
    name: 'Mumbai',
    region: 'Konkan',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    data: { temperature: 31.9, aqi: 161, ndvi: 0.26, population: '12.4M', risk: 'high' }
  },
  {
    name: 'Pune',
    region: 'Western',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    data: { temperature: 27.8, aqi: 98, ndvi: 0.44, population: '3.1M', risk: 'low' }
  },
  {
    name: 'Nagpur',
    region: 'Vidarbha',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    data: { temperature: 38.4, aqi: 166, ndvi: 0.18, population: '2.4M', risk: 'high' }
  },
  {
    name: 'Nashik',
    region: 'Western',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    data: { temperature: 32.1, aqi: 142, ndvi: 0.31, population: '1.5M', risk: 'moderate' }
  },
  {
    name: 'Thane',
    region: 'Konkan',
    coordinates: { lat: 19.2183, lng: 72.9781 },
    data: { temperature: 30.5, aqi: 155, ndvi: 0.29, population: '1.8M', risk: 'high' }
  },
  {
    name: 'Aurangabad',
    region: 'Marathwada',
    coordinates: { lat: 19.8762, lng: 75.3433 },
    data: { temperature: 35.2, aqi: 134, ndvi: 0.22, population: '1.2M', risk: 'moderate' }
  }
];

// Routes
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/cities', (req, res) => {
  console.log('Cities data requested');
  res.json(maharashtraCities);
});

app.get('/api/environmental/dashboard', (req, res) => {
  console.log('Dashboard data requested');
  
  const totalCities = maharashtraCities.length;
  const avgTemperature = maharashtraCities.reduce((sum, city) => sum + city.data.temperature, 0) / totalCities;
  const avgAQI = maharashtraCities.reduce((sum, city) => sum + city.data.aqi, 0) / totalCities;
  const avgNDVI = maharashtraCities.reduce((sum, city) => sum + city.data.ndvi, 0) / totalCities;
  
  const temperatureTrend = [
    { month: 'Jan', temp: 24.5, avgTemp: 23.8 },
    { month: 'Feb', temp: 27.2, avgTemp: 26.1 },
    { month: 'Mar', temp: 32.1, avgTemp: 30.4 },
    { month: 'Apr', temp: 35.8, avgTemp: 34.2 },
    { month: 'May', temp: 38.9, avgTemp: 37.1 },
    { month: 'Jun', temp: 33.4, avgTemp: 32.8 },
  ];

  res.json({
    statistics: {
      totalCities,
      avgTemperature: Math.round(avgTemperature * 10) / 10,
      avgAQI: Math.round(avgAQI),
      avgNDVI: Math.round(avgNDVI * 100) / 100
    },
    cities: maharashtraCities,
    temperatureTrend
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/environmental/dashboard`);
});