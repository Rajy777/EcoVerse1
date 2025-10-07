# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Ecoverse Dashboard is an environmental monitoring platform that combines 3D visualization with real-time environmental data for Maharashtra cities. It features a React TypeScript frontend with Three.js 3D Earth visualization and a Node.js/Express backend with MongoDB and OpenAI integration.

## Common Commands

### Development Setup
```bash
# Install all dependencies (root, frontend, backend)
npm run install:all

# Start both frontend and backend in development mode
npm run dev

# Start only backend in development
npm run backend:dev

# Start only frontend in development
npm run frontend:dev
```

### Individual Service Commands
```bash
# Backend development (from backend/ directory)
cd backend && npm run dev

# Frontend development (from frontend/ directory)  
cd frontend && npm start

# Backend production (from backend/ directory)
cd backend && npm start

# Frontend build (from frontend/ directory)
cd frontend && npm run build
```

### Testing
```bash
# Frontend tests
cd frontend && npm test

# Backend tests (placeholder - no tests implemented yet)
cd backend && npm test
```

### Database Operations
```bash
# The backend automatically initializes sample data on first run
# MongoDB connection string: mongodb://localhost:27017/ecoverse
```

### Environment Setup
```bash
# Copy environment template
cd backend && cp .env.example .env

# Required environment variables:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/ecoverse  
# JWT_SECRET=your-super-secret-jwt-key
# OPENAI_API_KEY=your-openai-api-key
```

## Architecture Overview

### Frontend Architecture (React TypeScript)
- **App.tsx**: Main application with 3D Earth visualization using Three.js and R3F
- **Components Structure**:
  - `MainDashboard`: Environmental data dashboard with charts and statistics
  - `FilterPanel`: Advanced filtering interface for city data
  - `InsightsPage`: AI-generated environmental insights display
  - `AboutPage`: Project information and features

### 3D Visualization System
- **Three.js Integration**: Uses @react-three/fiber and @react-three/drei
- **Earth Component**: Distorted sphere material with orbital rings and particle effects
- **Animation**: Framer Motion for UI animations, auto-rotating 3D Earth
- **Styling**: Tailwind CSS with custom eco-themed colors and glass morphism effects

### Backend Architecture (Node.js/Express)
- **server.js**: Monolithic server file containing all routes and logic
- **Database Schemas**:
  - `User`: Authentication with roles (citizen, planner, leader, researcher)
  - `City`: Maharashtra cities with coordinates and environmental data
  - `Chat`: AI chat history storage
- **Key Features**:
  - JWT authentication with 7-day expiration
  - OpenAI GPT-3.5-turbo integration for environmental insights
  - Advanced filtering system for city data
  - Real-time dashboard statistics calculation

### API Architecture
- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Environmental Data**: `/api/cities`, `/api/environmental/dashboard`, `/api/cities/filter`
- **AI Features**: `/api/ai/chat` (protected), `/api/ai/insights` (protected)
- **Health Check**: `/api/health`

### Data Flow Patterns
- Frontend components fetch data directly from backend APIs
- Authentication token stored client-side, passed in Authorization header
- AI chat requires authentication, provides contextual environmental responses
- Dashboard aggregates statistics from all city data in real-time

## Technology Stack

### Frontend Dependencies
- **React 19** with TypeScript for component architecture
- **@react-three/fiber** & **@react-three/drei** for 3D WebGL rendering
- **Framer Motion** for advanced animations and page transitions
- **Recharts** for environmental data visualization charts
- **Tailwind CSS** with custom eco-theme configuration
- **Lucide React** for consistent iconography
- **Axios** for HTTP client requests

### Backend Dependencies
- **Express 5** with comprehensive middleware stack
- **Mongoose 8** for MongoDB object modeling
- **OpenAI 6** for AI-powered environmental insights
- **JWT** for stateless authentication
- **bcryptjs** for password hashing
- **Helmet**, **CORS**, **Morgan** for security and logging

### Development Tools
- **Concurrently** for running multiple development servers
- **Nodemon** for backend auto-reload in development
- **TypeScript** for both frontend and backend type safety

## Development Patterns

### Component Organization
- Components are organized by feature/page in `/src/components/`
- Each component uses TypeScript interfaces for props
- Framer Motion animations are consistently applied for smooth UX
- Glass morphism styling pattern used throughout (`glass` CSS class)

### State Management
- Local React state for UI interactions (no global state library)
- API responses cached in component state
- Authentication state handled at component level

### API Integration
- Backend provides both mock data and real-time calculations
- Cities collection pre-populated with Maharashtra cities on server startup
- AI integration includes fallback responses for service failures
- Error handling implemented at both client and server levels

### Environmental Data Structure
Cities contain comprehensive environmental metrics:
- Temperature, AQI (Air Quality Index), NDVI (Vegetation Index)
- Population data and risk assessment levels
- Geographic coordinates for mapping visualization
- Regional classification within Maharashtra

### AI Integration Patterns
- System prompts specifically tuned for environmental context
- Chat history stored in database with user association
- Contextual responses about Maharashtra's environmental challenges
- Fallback mechanisms when OpenAI service is unavailable

## Development Notes

### Port Configuration
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

### Database Schema
The application uses MongoDB with three main collections:
- **cities**: Environmental data for 34+ Maharashtra cities
- **users**: Authentication and role-based access
- **chats**: AI conversation history

### Mock Data Patterns
- Maharashtra cities data includes realistic environmental metrics
- Temperature ranges: 24-38°C, AQI: 98-166, NDVI: 0.18-0.44
- Risk levels calculated based on combined environmental factors

### Windows Development Considerations
- PowerShell scripts use `&&` operators for command chaining
- Environment variables follow Windows conventions
- File paths use forward slashes for cross-platform compatibility