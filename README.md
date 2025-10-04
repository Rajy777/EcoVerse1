# EcoVerse1
Type: Full-stack environmental monitoring platform with 3D visualization and AI integration

🌟 Key Features Implemented

🌍 3D Earth Visualization
•  Interactive 3D Earth with Three.js and WebGL
•  Green orbital rings representing environmental monitoring networks
•  Particle effects for atmospheric ambiance
•  Auto-rotating camera with smooth controls

📊 Environmental Dashboard
•  34 Maharashtra Cities monitoring (Mumbai, Pune, Nagpur, etc.)
•  Real-time data visualization with bar and line charts
•  Temperature trends with historical comparisons
•  Air Quality Index tracking and visualization
•  Vegetation Index (NDVI) monitoring
•  Risk assessment with color-coded alerts

🤖 AI-Powered Features
•  GPT integration for environmental insights
•  Contextual chat assistant for data queries
•  Predictive analytics for weather and air quality
•  AI-generated recommendations for urban planning

🔍 Advanced Filtering System
•  Multi-criteria filtering by temperature, AQI, NDVI, and price
•  Regional filters for Maharashtra regions
•  Interactive sliders with real-time updates
•  Smart search functionality

🛠️ Technology Stack

Frontend
•  ✅ React 18 with TypeScript
•  ✅ Three.js for 3D visualization
•  ✅ Framer Motion for animations
•  ✅ Tailwind CSS for styling
•  ✅ Recharts for data visualization
•  ✅ Lucide React for icons

Backend
•  ✅ Node.js with Express server
•  ✅ MongoDB with Mongoose schemas
•  ✅ OpenAI GPT integration
•  ✅ JWT authentication system
•  ✅ bcryptjs for security

📂 Project Structure Created
ecoverse-dashboard/
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── components/        # Dashboard components
│   │   │   ├── MainDashboard.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── InsightsPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── App.tsx           # Main app with 3D Earth
│   │   └── index.css         # Tailwind styles
├── backend/                   # Express API server
│   ├── server.js             # Main server with AI integration
│   └── .env.example          # Environment template
├── package.json              # Root package with scripts
├── .gitignore               # Git ignore file
└── README.md                # Comprehensive documentation
🚀 How to Run

1. Install Dependencies:
2.    npm run install:all
3.2. Setup Environment:
     cd backend
   cp .env.example .env
   # Add your OpenAI API key to .env
      cd backend
   cp .env.example .env
   # Add your OpenAI API key to .env
      npm run dev

      4. Access Application:
◦  Frontend: http://localhost:3000
◦  Backend API: http://localhost:5000/api/health
