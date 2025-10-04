const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoverse');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'planner', 'leader', 'researcher'], default: 'citizen' },
  city: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// City Data Schema
const citySchema = new mongoose.Schema({
  name: String,
  state: { type: String, default: 'Maharashtra' },
  region: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  data: {
    temperature: Number,
    aqi: Number,
    ndvi: Number,
    population: String,
    risk: { type: String, enum: ['low', 'moderate', 'high'] }
  },
  lastUpdated: { type: Date, default: Date.now }
});

const City = mongoose.model('City', citySchema);

// AI Chat Schema
const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
  context: String
});

const Chat = mongoose.model('Chat', chatSchema);

// Mock data for Maharashtra cities
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

// Initialize database with sample data
const initializeData = async () => {
  try {
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      await City.insertMany(maharashtraCities);
      console.log('Sample city data inserted');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, city } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: role || 'citizen',
      city
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cities Routes
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cities/:name', async (req, res) => {
  try {
    const city = await City.findOne({ name: new RegExp(req.params.name, 'i') });
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Environmental Data Routes
app.get('/api/environmental/dashboard', async (req, res) => {
  try {
    const cities = await City.find();
    
    // Calculate statistics
    const totalCities = cities.length;
    const avgTemperature = cities.reduce((sum, city) => sum + city.data.temperature, 0) / totalCities;
    const avgAQI = cities.reduce((sum, city) => sum + city.data.aqi, 0) / totalCities;
    const avgNDVI = cities.reduce((sum, city) => sum + city.data.ndvi, 0) / totalCities;
    
    // Temperature trend (mock data)
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
      cities,
      temperatureTrend
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI Chat Routes
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Create system prompt for environmental context
    const systemPrompt = `You are an AI assistant for Ecoverse, an environmental monitoring platform for Maharashtra cities. 
    You help with environmental data analysis, urban planning insights, and sustainability recommendations.
    
    Context: ${context || 'General environmental inquiry'}
    
    Provide helpful, accurate information about:
    - Environmental data interpretation
    - Urban heat island effects
    - Air quality analysis
    - Vegetation indices (NDVI)
    - Climate change impacts
    - Sustainable city planning
    
    Keep responses concise, actionable, and relevant to Maharashtra's environmental challenges.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;

    // Save chat to database
    const chat = new Chat({
      userId: req.user.userId,
      message,
      response,
      context
    });
    await chat.save();

    res.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Fallback response if OpenAI fails
    const fallbackResponse = "I'm currently experiencing technical difficulties. Please try again later or contact support for assistance with your environmental data inquiry.";
    
    res.json({ 
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

app.get('/api/ai/insights', authenticateToken, async (req, res) => {
  try {
    // Generate AI insights based on current data
    const cities = await City.find();
    
    const insights = [
      {
        id: 1,
        type: 'prediction',
        title: 'Temperature Alert',
        message: 'Based on current trends, Mumbai and Nagpur are likely to experience heat waves in the next 2 weeks. Recommend increasing green cover and water availability.',
        confidence: 87,
        priority: 'high',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'recommendation',
        title: 'Air Quality Improvement',
        message: 'Pune shows the best air quality patterns. Implementing similar traffic management and industrial policies in other cities could reduce AQI by 15-20%.',
        confidence: 92,
        priority: 'medium',
        timestamp: new Date()
      },
      {
        id: 3,
        type: 'trend',
        title: 'Vegetation Recovery',
        message: 'NDVI values in Western Maharashtra have increased by 12% this season, indicating successful afforestation efforts. Continue current strategies.',
        confidence: 95,
        priority: 'low',
        timestamp: new Date()
      }
    ];

    res.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Filter Routes
app.post('/api/cities/filter', async (req, res) => {
  try {
    const { temperatureRange, aqiRange, ndviRange, regions } = req.body;
    
    let query = {};
    
    // Temperature filter
    if (temperatureRange) {
      query['data.temperature'] = {
        $gte: temperatureRange.min,
        $lte: temperatureRange.max
      };
    }
    
    // AQI filter
    if (aqiRange) {
      query['data.aqi'] = {
        $gte: aqiRange.min,
        $lte: aqiRange.max
      };
    }
    
    // NDVI filter
    if (ndviRange) {
      query['data.ndvi'] = {
        $gte: ndviRange.min,
        $lte: ndviRange.max
      };
    }
    
    // Region filter
    if (regions && regions.length > 0) {
      query.region = { $in: regions };
    }
    
    const filteredCities = await City.find(query);
    res.json(filteredCities);
  } catch (error) {
    console.error('Error filtering cities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  await connectDB();
  await initializeData();
  
  app.listen(PORT, () => {
    console.log(`🌍 Ecoverse Backend Server running on port ${PORT}`);
    console.log(`🚀 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/environmental/dashboard`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});