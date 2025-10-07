# 🌍 Ecoverse Dashboard

**Reimagining Healthy Cities with Space Data**

A cutting-edge environmental monitoring platform that leverages satellite data, artificial intelligence, and community collaboration to provide actionable insights for sustainable urban development across Maharashtra's cities.

![Ecoverse Dashboard](https://img.shields.io/badge/Status-Active%20Development-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-darkgreen.svg)
![AI Powered](https://img.shields.io/badge/AI-OpenAI%20GPT-orange.svg)

## ✨ Features

### 🎯 Core Capabilities
- **3D Interactive Earth Visualization** - Stunning WebGL-powered 3D Earth with orbital rings and particle effects
- **Real-time Environmental Monitoring** - Track temperature, air quality, and vegetation across 34 Maharashtra cities
- **AI-Powered Insights** - GPT-powered environmental analysis and predictive recommendations
- **Advanced Filtering System** - Multi-criteria search by temperature, AQI, NDVI, and price ranges
- **Responsive Dashboard** - Beautiful glass-morphism design with smooth animations

### 📊 Data Visualization
- **Line Charts** - Temperature trends and historical data
- **Bar Charts** - Air Quality Index comparisons across cities
- **Pie Charts** - Environmental risk factor analysis
- **Real-time Statistics** - Live environmental metrics and alerts

### 🤖 AI Integration
- **Contextual Chat Assistant** - Ask questions about environmental data
- **Predictive Analytics** - Heat wave predictions and trend analysis
- **Smart Recommendations** - Data-driven urban planning insights
- **Automated Insights Generation** - AI-powered environmental reports

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **MongoDB** 5.x or higher
- **OpenAI API Key** (for AI features)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecoverse-dashboard
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

5. **Configure Environment Variables**
   ```env
   # Backend (.env)
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecoverse
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

7. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000/api/health

## 📁 Project Structure

```
ecoverse-dashboard/
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── MainDashboard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── InsightsPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── App.tsx           # Main app with 3D Earth
│   │   └── index.css         # Tailwind CSS styles
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
├── backend/                   # Node.js Express backend
│   ├── server.js             # Main server file
│   ├── .env.example          # Environment template
│   └── package.json          # Backend dependencies
├── shared/                    # Shared utilities
└── README.md                 # This file
```

## 🗄️ Database Schema

### Cities Collection
```javascript
{
  name: "Mumbai",
  state: "Maharashtra", 
  region: "Konkan",
  coordinates: { lat: 19.0760, lng: 72.8777 },
  data: {
    temperature: 31.9,
    aqi: 161,
    ndvi: 0.26,
    population: "12.4M",
    risk: "high"
  },
  lastUpdated: Date
}
```

### Users Collection
```javascript
{
  email: "user@example.com",
  password: "hashed_password",
  name: "John Doe",
  role: "citizen", // citizen, planner, leader, researcher
  city: "Mumbai",
  createdAt: Date
}
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Environmental Data
- `GET /api/cities` - Get all cities
- `GET /api/cities/:name` - Get specific city data
- `GET /api/environmental/dashboard` - Dashboard statistics
- `POST /api/cities/filter` - Filter cities by criteria

### AI Features  
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/insights` - Get AI-generated insights

## 🎨 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** for 3D visualization  
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **OpenAI GPT** integration
- **JWT** authentication
- **bcryptjs** for security

### DevOps & Tools
- **Nodemon** for development
- **CORS** for cross-origin requests
- **Helmet** for security
- **Morgan** for logging

## 🌟 Key Features Explained

### 🌍 3D Earth Visualization
The centerpiece is an interactive 3D Earth built with Three.js featuring:
- **Rotating Earth sphere** with distortion material
- **Green orbital rings** representing environmental monitoring
- **Particle effects** for atmospheric ambiance
- **Smooth camera controls** with auto-rotation

### 📈 Environmental Dashboard
Comprehensive monitoring includes:
- **34 Maharashtra Cities** with real-time data
- **Temperature mapping** with heat island detection
- **Air Quality Index** tracking and alerts
- **Vegetation Index (NDVI)** monitoring
- **Risk assessment** with color-coded alerts

### 🔍 Advanced Filtering
Multi-criteria filtering system:
- **Temperature Range** - Find cities within specific temperature ranges
- **Air Quality Index** - Filter by pollution levels
- **Vegetation Index** - Search by green cover density
- **Price Range** - Property price-based filtering
- **Regional Filtering** - Maharashtra regions (Konkan, Western, etc.)

### 🤖 AI Assistant
GPT-powered environmental intelligence:
- **Contextual responses** about environmental data
- **Predictive analytics** for weather and air quality
- **Urban planning recommendations** 
- **Trend analysis** and insights generation

## 🚀 Development

### Running Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests  
cd backend && npm test
```

### Building for Production
```bash
# Build frontend
cd frontend && npm run build

# Start production backend
cd backend && npm start
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ 3D Earth visualization
- ✅ Environmental dashboard
- ✅ AI chat integration
- ✅ City filtering system

### Phase 2 (Next)
- 🔄 Real satellite data integration
- 🔄 Mobile app development
- 🔄 Advanced AI predictions
- 🔄 Community features

### Phase 3 (Future)
- 📋 IoT sensor integration
- 📋 Government API connections
- 📋 Machine learning models
- 📋 Policy recommendation engine

## 📊 Data Sources

- **NASA MODIS** - Land Surface Temperature and NDVI data
- **Ground Sensors** - Air quality and weather stations  
- **Community Reports** - Citizen-generated environmental data
- **Government APIs** - Official environmental monitoring data

## 🤝 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discord**: [Community Chat](link-to-discord)
- **Email**: support@ecoverse-dashboard.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** for MODIS satellite data
- **OpenAI** for GPT integration
- **Three.js** community for 3D visualization tools
- **Maharashtra Pollution Control Board** for environmental data
- **Contributors** who made this project possible

---

**Built with ❤️ for a sustainable future** 🌱

*Ecoverse Dashboard - Making environmental data accessible, actionable, and beautiful.*