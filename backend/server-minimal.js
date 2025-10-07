const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ZoneAnalysis } = require('./algorithms');
const { cityZonesData, getAllZones, getCityZones, getCityStats } = require('./city-zones-data');
const { getAllCities, getCityByName, getCitiesByRegion, filterCities, searchCities } = require('./indian-cities-data');
const { nasaDataFetcher } = require('./nasa-api-integration');
const { DynamicZoneGenerator } = require('./dynamic-zone-generator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize dynamic zone generator
const zoneGenerator = new DynamicZoneGenerator();

// Initialize Gemini AI
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('✅ Gemini AI initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error.message);
  }
} else {
  console.warn('⚠️  Gemini API key not found, using fallback AI responses');
}

console.log('🚀 Starting EcoVerse server with advanced AI...');

// Basic middleware with production CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ecoverse-frontend.onrender.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

// Enhanced cities API with comprehensive Indian cities data
app.get('/api/cities', (req, res) => {
  console.log('All Indian cities data requested');
  const allCities = getAllCities();
  res.json({
    cities: allCities,
    total: allCities.length,
    regions: ['Northern', 'Western', 'Southern', 'Eastern', 'Central'],
    lastUpdated: new Date().toISOString()
  });
});

// Filter cities endpoint
app.get('/api/cities/filter', (req, res) => {
  console.log('Filtered cities requested with filters:', req.query);
  
  const filters = {
    region: req.query.region,
    tempMin: req.query.tempMin ? parseFloat(req.query.tempMin) : undefined,
    tempMax: req.query.tempMax ? parseFloat(req.query.tempMax) : undefined,
    aqiMin: req.query.aqiMin ? parseFloat(req.query.aqiMin) : undefined,
    aqiMax: req.query.aqiMax ? parseFloat(req.query.aqiMax) : undefined,
    ndviMin: req.query.ndviMin ? parseFloat(req.query.ndviMin) : undefined,
    ndviMax: req.query.ndviMax ? parseFloat(req.query.ndviMax) : undefined,
    risk: req.query.risk
  };
  
  const filteredCities = filterCities(filters);
  
  res.json({
    cities: filteredCities,
    total: filteredCities.length,
    filters: filters,
    appliedAt: new Date().toISOString()
  });
});

// Search cities endpoint
app.get('/api/cities/search', (req, res) => {
  const query = req.query.q;
  
  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }
  
  console.log(`Searching cities for: "${query}"`);
  
  const results = searchCities(query);
  
  res.json({
    query,
    results,
    total: results.length,
    searchedAt: new Date().toISOString()
  });
});

// Get specific city data
app.get('/api/cities/:cityName', async (req, res) => {
  const cityName = req.params.cityName;
  console.log(`City data requested for: ${cityName}`);
  
  const city = getCityByName(cityName);
  
  if (!city) {
    return res.status(404).json({ error: 'City not found', cityName });
  }
  
  try {
    // Fetch real-time NASA data for the city
    const nasaData = await nasaDataFetcher.fetchComprehensiveData(
      city.coordinates.lat, 
      city.coordinates.lng
    );
    
    const enhancedCityData = {
      ...city,
      nasaData,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(enhancedCityData);
  } catch (error) {
    console.error('Error fetching NASA data for city:', error.message);
    // Return city data without NASA enhancement if API fails
    res.json({
      ...city,
      lastUpdated: new Date().toISOString(),
      note: 'NASA data temporarily unavailable'
    });
  }
});

// Get historical data for a city
app.get('/api/cities/:cityName/historical/:parameter', async (req, res) => {
  const { cityName, parameter } = req.params;
  const days = parseInt(req.query.days) || 30;
  
  console.log(`Historical ${parameter} data requested for ${cityName}, ${days} days`);
  
  const city = getCityByName(cityName);
  
  if (!city) {
    return res.status(404).json({ error: 'City not found', cityName });
  }
  
  try {
    const historicalData = await nasaDataFetcher.fetchHistoricalData(
      city.coordinates.lat,
      city.coordinates.lng,
      parameter,
      days
    );
    
    res.json({
      city: city.name,
      ...historicalData
    });
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({ 
      error: 'Historical data unavailable', 
      details: error.message,
      city: city.name,
      parameter
    });
  }
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

// Enhanced AI response generation using Gemini AI
async function generateAIResponse(message) {
  // Create context about EcoVerse and Maharashtra environmental data
  const context = `
You are an AI assistant for EcoVerse, a comprehensive environmental monitoring platform covering major cities across India. 

Current Environmental Data Summary by Region:

NORTHERN INDIA:
- Delhi: 42.8°C, AQI 165 (Unhealthy), NDVI 0.20, Population 30M+, Risk: Critical

SOUTHERN INDIA:
- Bangalore: 26.5°C, AQI 95 (Moderate), NDVI 0.38, Population 12M+, Risk: Low-Medium
- Chennai: 34.2°C, AQI 148 (Unhealthy), NDVI 0.21, Population 10M+, Risk: High  
- Hyderabad: 32.8°C, AQI 125 (Unhealthy), NDVI 0.33, Population 9M+, Risk: Medium

WESTERN INDIA:
- Mumbai: 36.9°C, AQI 161 (Unhealthy), NDVI 0.26, Population 20M+, Risk: High
- Pune: 30.2°C, AQI 98 (Moderate), NDVI 0.39, Population 6M+, Risk: Low-Medium
- Ahmedabad: 38.4°C, AQI 152 (Unhealthy), NDVI 0.28, Population 8M+, Risk: High

EASTERN INDIA:
- Kolkata: 32.4°C, AQI 142 (Unhealthy), NDVI 0.32, Population 14M+, Risk: Medium-High
- Bhubaneswar: 31.9°C, AQI 118 (Moderate), NDVI 0.41, Population 1M+, Risk: Low-Medium

You provide expert guidance on:
- Pan-India environmental analysis and regional comparisons
- Climate zone-specific urban planning recommendations  
- Regional climate adaptation and mitigation strategies
- City-specific air quality and health advisories
- Sustainable development solutions for different Indian regions
- Cross-regional environmental policy recommendations

Respond with authoritative, region-aware insights. Consider India's diverse climate zones and urban development patterns.

User Question: ${message}`;

  if (model) {
    try {
      console.log('Calling Gemini API with context length:', context.length);
      const result = await model.generateContent(context);
      const response = await result.response;
      const text = response.text();
      console.log('✅ Gemini responded successfully');
      return text;
    } catch (error) {
      console.error('❌ Gemini API error details:');
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error code:', error.code);
      console.error('Full error:', error);
      return getFallbackResponse(message);
    }
  } else {
    console.log('⚠️ No Gemini model available, using fallback');
    return getFallbackResponse(message);
  }
}

// Fallback responses when Gemini is unavailable
function getFallbackResponse(message) {
  const lowercaseMessage = message.toLowerCase();
  
  const fallbackResponses = {
    'temperature': 'Based on current pan-India data, temperatures vary significantly across regions. Delhi shows extreme heat at 42.8°C (critical risk), while Bangalore maintains moderate 26.5°C. Northern cities require immediate heat mitigation strategies.',
    'aqi': 'Air quality across Indian cities shows concerning patterns. Delhi (165 AQI) and Mumbai (161 AQI) are in unhealthy ranges. Southern cities like Bangalore (95 AQI) show better air quality. Implement region-specific pollution control measures.',
    'ndvi': 'Vegetation health varies dramatically across India. Bhubaneswar leads with 0.41 NDVI, while Delhi shows concerning levels at 0.20. Urban greening initiatives are critical for northern and western metropolitan areas.',
    'risk': 'Regional risk assessment shows Delhi at critical level, Mumbai and Chennai at high risk. Southern cities like Bangalore show lower risk profiles. Implement climate-specific resilience planning for each region.',
    'default': 'I can help you analyze environmental data across major Indian cities from North to South. Ask me about regional temperature patterns, air quality comparisons, vegetation health, climate risks, or region-specific urban planning strategies. How can I assist with your environmental analysis today?'
  };
  
  if (lowercaseMessage.includes('temperature') || lowercaseMessage.includes('heat') || lowercaseMessage.includes('hot')) {
    return fallbackResponses.temperature;
  } else if (lowercaseMessage.includes('aqi') || lowercaseMessage.includes('air') || lowercaseMessage.includes('pollution')) {
    return fallbackResponses.aqi;
  } else if (lowercaseMessage.includes('ndvi') || lowercaseMessage.includes('vegetation') || lowercaseMessage.includes('green')) {
    return fallbackResponses.ndvi;
  } else if (lowercaseMessage.includes('risk') || lowercaseMessage.includes('danger') || lowercaseMessage.includes('climate')) {
    return fallbackResponses.risk;
  } else {
    return fallbackResponses.default;
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
  let cityZones = getCityZones(cityName);
  let isGenerated = false;
  
  // If no predefined zones exist, generate them dynamically
  if (!cityZones.length) {
    console.log(`No predefined zones for ${cityName}, generating dynamically...`);
    try {
      const generatedCityData = zoneGenerator.generateZonesForCity(cityName);
      cityZones = generatedCityData.zones;
      isGenerated = true;
      console.log(`✅ Generated ${cityZones.length} zones for ${cityName}`);
    } catch (error) {
      console.error(`Failed to generate zones for ${cityName}:`, error.message);
      return res.status(404).json({ 
        error: 'City not found or unable to generate zone data', 
        cityName,
        details: error.message 
      });
    }
  }
  
  try {
    const analyzer = new ZoneAnalysis(cityZones);
    const analysis = analyzer.performCompleteAnalysis();
    
    res.json({
      cityName,
      ...analysis,
      isGenerated,
      dataSource: isGenerated ? 'dynamically-generated' : 'predefined',
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
  let cityZones = getCityZones(cityName);
  let isGenerated = false;
  
  // Use dynamic generator if no predefined zones
  if (!cityZones.length) {
    try {
      const generatedCityData = zoneGenerator.generateZonesForCity(cityName);
      cityZones = generatedCityData.zones;
      isGenerated = true;
    } catch (error) {
      return res.status(404).json({ error: 'City not found', cityName });
    }
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
  let cityZones = getCityZones(cityName);
  let isGenerated = false;
  
  // Use dynamic generator if no predefined zones
  if (!cityZones.length) {
    try {
      const generatedCityData = zoneGenerator.generateZonesForCity(cityName);
      cityZones = generatedCityData.zones;
      isGenerated = true;
    } catch (error) {
      return res.status(404).json({ error: 'City not found', cityName });
    }
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
  let cityZones = getCityZones(cityName);
  let isGenerated = false;
  
  // Use dynamic generator if no predefined zones
  if (!cityZones.length) {
    try {
      const generatedCityData = zoneGenerator.generateZonesForCity(cityName);
      cityZones = generatedCityData.zones;
      isGenerated = true;
    } catch (error) {
      return res.status(404).json({ error: 'City not found', cityName });
    }
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

// AI Chat endpoint with Gemini integration
app.post('/api/ai/chat', async (req, res) => {
  console.log('AI chat request received');
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    const response = await generateAIResponse(message);
    
    res.json({
      message,
      response,
      timestamp: new Date().toISOString(),
      service: model ? 'Google Gemini AI' : 'Fallback AI Service',
      model: model ? 'gemini-1.5-flash' : 'fallback'
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      error: 'AI service temporarily unavailable',
      message,
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ EcoVerse Advanced Analytics Server running on port ${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/environmental/dashboard`);
  console.log(`🤖 AI Chat API: http://localhost:${PORT}/api/ai/chat ${model ? '(Powered by Google Gemini)' : '(Using Fallback Responses)'}`);
  console.log(`🗺️  Zone Analysis APIs:`);
  console.log(`   • Cities: http://localhost:${PORT}/api/zones/cities`);
  console.log(`   • City Analysis: http://localhost:${PORT}/api/analysis/city/:cityName`);
  console.log(`   • Hotspots: http://localhost:${PORT}/api/analysis/hotspots/:cityName`);
  console.log(`   • Parks: http://localhost:${PORT}/api/analysis/parks/:cityName`);
  console.log(`   • Clinics: http://localhost:${PORT}/api/analysis/clinics/:cityName`);
  console.log(`   • State Overview: http://localhost:${PORT}/api/analysis/overview`);
  console.log(``);
  console.log(`🤖 AI Service Status: ${model ? 'Google Gemini 1.5 Flash ✅' : 'Fallback Mode ⚠️'}`);
});
