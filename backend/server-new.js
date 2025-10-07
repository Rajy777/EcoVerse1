const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Maharashtra cities data
const maharashtraCities = [
  {
    id: 1,
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'Konkan',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    data: { temperature: 31.9, aqi: 161, ndvi: 0.26, population: '12.4M', risk: 'high' }
  },
  {
    id: 2,
    name: 'Pune',
    state: 'Maharashtra',
    region: 'Western',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    data: { temperature: 27.8, aqi: 98, ndvi: 0.44, population: '3.1M', risk: 'low' }
  },
  {
    id: 3,
    name: 'Nagpur',
    state: 'Maharashtra',
    region: 'Vidarbha',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    data: { temperature: 38.4, aqi: 166, ndvi: 0.18, population: '2.4M', risk: 'high' }
  },
  {
    id: 4,
    name: 'Nashik',
    state: 'Maharashtra',
    region: 'Western',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    data: { temperature: 32.1, aqi: 142, ndvi: 0.31, population: '1.5M', risk: 'moderate' }
  },
  {
    id: 5,
    name: 'Thane',
    state: 'Maharashtra',
    region: 'Konkan',
    coordinates: { lat: 19.2183, lng: 72.9781 },
    data: { temperature: 30.5, aqi: 155, ndvi: 0.29, population: '1.8M', risk: 'high' }
  },
  {
    id: 6,
    name: 'Aurangabad',
    state: 'Maharashtra',
    region: 'Marathwada',
    coordinates: { lat: 19.8762, lng: 75.3433 },
    data: { temperature: 35.2, aqi: 134, ndvi: 0.22, population: '1.2M', risk: 'moderate' }
  }
];

// Initialize AI service
let aiService = null;

const initializeAI = async () => {
  try {
    if (process.env.OPENAI_API_KEY) {
      const { OpenAI } = require('openai');
      aiService = {
        type: 'openai',
        client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
        model: 'gpt-3.5-turbo'
      };
      console.log('✅ OpenAI initialized');
    } else if (process.env.OPENROUTER_API_KEY) {
      const { OpenAI } = require('openai');
      aiService = {
        type: 'openrouter',
        client: new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
        }),
        model: 'meta-llama/llama-3.1-8b-instruct:free'
      };
      console.log('✅ OpenRouter initialized');
    } else if (process.env.HUGGINGFACE_API_KEY) {
      aiService = {
        type: 'huggingface',
        apiKey: process.env.HUGGINGFACE_API_KEY,
        model: 'microsoft/DialoGPT-large'
      };
      console.log('✅ HuggingFace initialized');
    } else {
      // Use a free mock AI service
      aiService = {
        type: 'mock',
        model: 'environmental-assistant'
      };
      console.log('✅ Mock AI service initialized (free mode)');
    }
  } catch (error) {
    console.error('AI initialization failed:', error.message);
    // Fallback to mock service
    aiService = {
      type: 'mock',
      model: 'environmental-assistant'
    };
  }
};

// Helper functions for alternative AI services
const generateMockResponse = async (message, context) => {
  // Smart mock responses based on environmental topics
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('mumbai') || lowerMessage.includes('air quality')) {
    return 'Based on current data, Mumbai has an AQI of 161, which indicates poor air quality. This is primarily due to vehicle emissions, industrial activities, and dust. I recommend reducing outdoor activities during peak pollution hours and supporting green transportation initiatives.';
  }
  
  if (lowerMessage.includes('temperature') || lowerMessage.includes('heat')) {
    return 'Maharashtra cities are experiencing elevated temperatures. Mumbai shows 31.9°C while Nagpur reaches 38.4°C. Urban heat islands are a major concern. Solutions include increasing green cover, implementing cool roofing, and expanding urban forests.';
  }
  
  if (lowerMessage.includes('pune')) {
    return 'Pune demonstrates the best environmental performance among Maharashtra cities with an AQI of 98 and good vegetation index of 0.44. This success comes from effective urban planning, green initiatives, and better traffic management.';
  }
  
  if (lowerMessage.includes('ndvi') || lowerMessage.includes('vegetation')) {
    return 'NDVI (Normalized Difference Vegetation Index) measures plant health and density. Higher values indicate better green cover. Western Maharashtra shows improving trends with 12% increase this season, suggesting successful afforestation efforts.';
  }
  
  if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
    return 'Based on current environmental trends, we expect continued temperature rise in urban areas. Mumbai and Nagpur are at high risk for heat waves. Immediate actions needed: increase water availability, expand cooling centers, and accelerate green infrastructure projects.';
  }
  
  // Default response
  return 'I can help you analyze environmental data for Maharashtra cities. Ask me about air quality, temperature trends, vegetation indices, or urban planning recommendations. For example, you could ask about specific cities like Mumbai, Pune, or Nagpur.';
};

const callHuggingFaceAPI = async (message, aiService) => {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${aiService.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiService.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `Environmental Assistant: ${message}`,
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      })
    });
    
    const data = await response.json();
    return data[0]?.generated_text || 'I can help with environmental analysis. Please ask about air quality, temperature, or vegetation data.';
  } catch (error) {
    console.error('HuggingFace API error:', error);
    return await generateMockResponse(message);
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    aiService: aiService ? aiService.type : 'none'
  });
});

app.get('/api/cities', (req, res) => {
  res.json(maharashtraCities);
});

app.get('/api/environmental/dashboard', (req, res) => {
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

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!aiService) {
      return res.json({
        response: "I'm currently offline. Please configure an AI API key (OpenAI or OpenRouter) to enable chat functionality.",
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

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

    let response;
    
    if (aiService.type === 'mock') {
      // Free mock AI responses based on environmental topics
      response = await generateMockResponse(message, context);
    } else if (aiService.type === 'huggingface') {
      // HuggingFace API call
      response = await callHuggingFaceAPI(message, aiService);
    } else {
      // OpenAI/OpenRouter API call
      const completion = await aiService.client.chat.completions.create({
        model: aiService.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      });
      response = completion.choices[0].message.content;
    }

    res.json({ 
      response,
      timestamp: new Date().toISOString(),
      aiService: aiService.type
    });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    
    const fallbackResponse = `I'm experiencing technical difficulties. Error: ${error.message}. Please try again later or contact support for assistance with your environmental data inquiry.`;
    
    res.json({ 
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true,
      error: error.message
    });
  }
});

// AI Insights endpoint
app.get('/api/ai/insights', (req, res) => {
  const insights = [
    {
      id: 1,
      type: 'prediction',
      title: 'Temperature Alert',
      message: 'Based on current trends, Mumbai and Nagpur are likely to experience heat waves in the next 2 weeks. Recommend increasing green cover and water availability.',
      confidence: 87,
      priority: 'high',
      timestamp: new Date(),
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'Air Quality Improvement',
      message: 'Pune shows the best air quality patterns. Implementing similar traffic management and industrial policies in other cities could reduce AQI by 15-20%.',
      confidence: 92,
      priority: 'medium',
      timestamp: new Date(),
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    {
      id: 3,
      type: 'trend',
      title: 'Vegetation Recovery',
      message: 'NDVI values in Western Maharashtra have increased by 12% this season, indicating successful afforestation efforts. Continue current strategies.',
      confidence: 95,
      priority: 'low',
      timestamp: new Date(),
      coordinates: { lat: 19.9975, lng: 73.7898 }
    }
  ];

  res.json({
    insights,
    mapData: maharashtraCities // Include map data for visualization
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  await initializeAI();
  
  app.listen(PORT, () => {
    console.log(`🌍 Ecoverse Backend Server running on port ${PORT}`);
    console.log(`🚀 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/environmental/dashboard`);
    console.log(`💬 AI Chat: http://localhost:${PORT}/api/ai/chat`);
    console.log(`🔍 AI Insights: http://localhost:${PORT}/api/ai/insights`);
  });
};

startServer();