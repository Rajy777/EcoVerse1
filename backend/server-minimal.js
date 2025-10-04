const express = require('express');
const cors = require('cors');
const { ZoneAnalysis } = require('./algorithms');
const { cityZonesData, getAllZones, getCityZones, getCityStats } = require('./city-zones-data');
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

// Mock AI responses for environmental queries
const aiResponses = {
  'temperature': 'Based on current data, Maharashtra is experiencing elevated temperatures. Mumbai shows 31.9°C while Nagpur reaches 38.4°C. Consider heat mitigation strategies.',
  'aqi': 'Air quality across Maharashtra cities shows concerning levels. Mumbai (161 AQI) and Nagpur (166 AQI) are in unhealthy ranges. Recommend reducing outdoor activities.',
  'ndvi': 'Vegetation health varies significantly. Pune shows the best NDVI at 0.44, while Nagpur shows concerning levels at 0.18. Urban greening initiatives needed.',
  'risk': 'Risk assessment shows Mumbai, Thane, and Nagpur at high risk levels. Immediate attention needed for climate resilience planning.',
  'default': 'I can help you analyze environmental data for Maharashtra cities. Ask me about temperature, air quality, vegetation health, or climate risks.'
};

function generateAIResponse(message) {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('temperature') || lowercaseMessage.includes('heat') || lowercaseMessage.includes('hot')) {
    return aiResponses.temperature;
  } else if (lowercaseMessage.includes('aqi') || lowercaseMessage.includes('air') || lowercaseMessage.includes('pollution')) {
    return aiResponses.aqi;
  } else if (lowercaseMessage.includes('ndvi') || lowercaseMessage.includes('vegetation') || lowercaseMessage.includes('green')) {
    return aiResponses.ndvi;
  } else if (lowercaseMessage.includes('risk') || lowercaseMessage.includes('danger') || lowercaseMessage.includes('climate')) {
    return aiResponses.risk;
  } else {
    return aiResponses.default;
  }
}

// Zone Analysis endpoints

// Get all cities with zone data
app.get('/api/zones/cities', (req, res) => {
  console.log('Cities zone data requested');
  res.json(Object.values(cityZonesData));
});

// Get specific city zones
app.get('/api/zones/city/:cityName', (req, res) => {
  console.log(`Zones for ${req.params.cityName} requested`);
  const cityName = req.params.cityName;
  const cityStats = getCityStats(cityName);
  
  if (!cityStats) {
    return res.status(404).json({ error: 'City not found' });
  }
  
  res.json(cityStats);
});

// Perform comprehensive zone analysis for a city
app.get('/api/analysis/city/:cityName', (req, res) => {
  console.log(`Zone analysis for ${req.params.cityName} requested`);
  const cityName = req.params.cityName;
  const cityZones = getCityZones(cityName);
  
  if (!cityZones.length) {
    return res.status(404).json({ error: 'City not found' });
  }
  
  try {
    const analyzer = new ZoneAnalysis(cityZones);
    const analysis = analyzer.performCompleteAnalysis();
    
    res.json({
      cityName,
      ...analysis,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

// Get hotspot analysis for specific city
app.get('/api/analysis/hotspots/:cityName', (req, res) => {
  console.log(`Hotspot analysis for ${req.params.cityName} requested`);
  const cityName = req.params.cityName;
  const cityZones = getCityZones(cityName);
  
  if (!cityZones.length) {
    return res.status(404).json({ error: 'City not found' });
  }
  
  try {
    const analyzer = new ZoneAnalysis(cityZones);
    const hotspots = analyzer.hotspotDetector.detectHotspots();
    
    res.json({
      cityName,
      hotspots: hotspots.filter(zone => zone.hotspot.interventionNeeded),
      summary: {
        totalZones: hotspots.length,
        criticalHotspots: hotspots.filter(z => z.hotspot.priority === 'critical').length,
        highPriorityHotspots: hotspots.filter(z => z.hotspot.priority === 'high').length,
        totalCoolingPotential: Math.round(hotspots.reduce((sum, z) => sum + z.hotspot.coolingPotential, 0) * 10) / 10
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Hotspot analysis error:', error);
    res.status(500).json({ error: 'Hotspot analysis failed', details: error.message });
  }
});

// Get park recommendations for specific city
app.get('/api/analysis/parks/:cityName', (req, res) => {
  console.log(`Park recommendations for ${req.params.cityName} requested`);
  const cityName = req.params.cityName;
  const cityZones = getCityZones(cityName);
  
  if (!cityZones.length) {
    return res.status(404).json({ error: 'City not found' });
  }
  
  try {
    const analyzer = new ZoneAnalysis(cityZones);
    const recommendations = analyzer.parkRecommendor.generateRecommendations();
    
    const priorityParks = recommendations.filter(zone => 
      zone.parkRecommendation.category !== 'not-recommended'
    );
    
    res.json({
      cityName,
      recommendations: priorityParks,
      summary: {
        totalRecommendations: priorityParks.length,
        highestPriority: recommendations.filter(z => z.parkRecommendation.category === 'highest-priority').length,
        totalTreesNeeded: priorityParks.reduce((sum, z) => sum + z.parkRecommendation.treesNeeded, 0),
        totalInvestment: priorityParks.reduce((sum, z) => sum + z.parkRecommendation.estimatedCost, 0),
        projectedCooling: Math.round(priorityParks.reduce((sum, z) => sum + z.parkRecommendation.projectedCooling, 0) * 10) / 10
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Park recommendation error:', error);
    res.status(500).json({ error: 'Park recommendation failed', details: error.message });
  }
});

// Get clinic placement recommendations for specific city
app.get('/api/analysis/clinics/:cityName', (req, res) => {
  console.log(`Clinic placement analysis for ${req.params.cityName} requested`);
  const cityName = req.params.cityName;
  const cityZones = getCityZones(cityName);
  
  if (!cityZones.length) {
    return res.status(404).json({ error: 'City not found' });
  }
  
  try {
    const analyzer = new ZoneAnalysis(cityZones);
    const placements = analyzer.clinicPlacer.recommendPlacements();
    
    const clinicRecommendations = placements.filter(zone => 
      zone.clinicRecommendation.clinicType !== 'none'
    );
    
    res.json({
      cityName,
      recommendations: clinicRecommendations,
      summary: {
        totalRecommendations: clinicRecommendations.length,
        regionalHospitals: placements.filter(z => z.clinicRecommendation.clinicType === 'regional-hospital').length,
        specialtyClinics: placements.filter(z => z.clinicRecommendation.clinicType === 'specialty-clinic').length,
        totalCapacity: clinicRecommendations.reduce((sum, z) => sum + z.clinicRecommendation.capacity, 0),
        totalInvestment: clinicRecommendations.reduce((sum, z) => sum + z.clinicRecommendation.estimatedCost, 0),
        servicingPopulation: clinicRecommendations.reduce((sum, z) => sum + z.clinicRecommendation.servicingPopulation, 0)
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Clinic placement error:', error);
    res.status(500).json({ error: 'Clinic placement analysis failed', details: error.message });
  }
});

// Get comprehensive analysis for all cities
app.get('/api/analysis/overview', (req, res) => {
  console.log('Maharashtra state overview analysis requested');
  
  try {
    const stateOverview = {
      totalCities: Object.keys(cityZonesData).length,
      totalZones: getAllZones().length,
      cities: {},
      stateWideRecommendations: {
        criticalZones: [],
        priorityInvestments: [],
        totalInvestmentNeeded: 0
      }
    };
    
    // Analyze each city
    Object.values(cityZonesData).forEach(city => {
      const analyzer = new ZoneAnalysis(city.zones);
      const analysis = analyzer.performCompleteAnalysis();
      
      stateOverview.cities[city.name.toLowerCase()] = {
        name: city.name,
        totalZones: city.zones.length,
        population: city.totalPopulation,
        summary: analysis.summary,
        criticalZones: analysis.zones.filter(z => z.analysis.overallPriority === 'critical').length,
        highPriorityZones: analysis.zones.filter(z => z.analysis.overallPriority === 'high').length
      };
      
      // Collect critical zones for state-wide prioritization
      analysis.zones.forEach(zone => {
        if (zone.analysis.overallPriority === 'critical') {
          stateOverview.stateWideRecommendations.criticalZones.push({
            city: city.name,
            zone: zone.name,
            actions: analysis.recommendations.immediate.find(r => r.zoneName === zone.name)?.actions || []
          });
        }
      });
    });
    
    stateOverview.generatedAt = new Date().toISOString();
    res.json(stateOverview);
  } catch (error) {
    console.error('State overview error:', error);
    res.status(500).json({ error: 'State overview analysis failed', details: error.message });
  }
});

// AI Chat endpoint
app.post('/api/ai/chat', (req, res) => {
  console.log('AI chat request received');
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  const response = generateAIResponse(message);
  
  res.json({
    message,
    response,
    timestamp: new Date().toISOString(),
    service: 'Mock AI Service'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ EcoVerse Advanced Analytics Server running on port ${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/environmental/dashboard`);
  console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/ai/chat`);
  console.log(`🗺️  Zone Analysis APIs:`);
  console.log(`   • Cities: http://localhost:${PORT}/api/zones/cities`);
  console.log(`   • City Analysis: http://localhost:${PORT}/api/analysis/city/:cityName`);
  console.log(`   • Hotspots: http://localhost:${PORT}/api/analysis/hotspots/:cityName`);
  console.log(`   • Parks: http://localhost:${PORT}/api/analysis/parks/:cityName`);
  console.log(`   • Clinics: http://localhost:${PORT}/api/analysis/clinics/:cityName`);
  console.log(`   • State Overview: http://localhost:${PORT}/api/analysis/overview`);
});
