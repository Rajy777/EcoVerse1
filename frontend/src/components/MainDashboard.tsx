import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  MapPin, Thermometer, Wind, Droplets, Leaf, TrendingUp, TrendingDown,
  Users, Building, Car, Factory 
} from 'lucide-react';

// Mock data for Maharashtra cities - inspired by your screenshots
const maharashtraCities = [
  { name: 'Mumbai', region: 'Konkan', temp: 31.9, aqi: 161, ndvi: 0.26, population: '12.4M', risk: 'high' },
  { name: 'Pune', region: 'Western', temp: 27.8, aqi: 98, ndvi: 0.44, population: '3.1M', risk: 'low' },
  { name: 'Nagpur', region: 'Vidarbha', temp: 38.4, aqi: 166, ndvi: 0.18, population: '2.4M', risk: 'high' },
  { name: 'Nashik', region: 'Western', temp: 32.1, aqi: 142, ndvi: 0.31, population: '1.5M', risk: 'moderate' },
  { name: 'Thane', region: 'Konkan', temp: 30.5, aqi: 155, ndvi: 0.29, population: '1.8M', risk: 'high' },
  { name: 'Aurangabad', region: 'Marathwada', temp: 35.2, aqi: 134, ndvi: 0.22, population: '1.2M', risk: 'moderate' },
];

// Temperature trend data
const temperatureTrend = [
  { month: 'Jan', temp: 24.5, avgTemp: 23.8 },
  { month: 'Feb', temp: 27.2, avgTemp: 26.1 },
  { month: 'Mar', temp: 32.1, avgTemp: 30.4 },
  { month: 'Apr', temp: 35.8, avgTemp: 34.2 },
  { month: 'May', temp: 38.9, avgTemp: 37.1 },
  { month: 'Jun', temp: 33.4, avgTemp: 32.8 },
];

// Air Quality Index data
const aqiData = [
  { city: 'Pune', aqi: 98 },
  { city: 'Nashik', aqi: 142 },
  { city: 'Thane', aqi: 155 },
  { city: 'Mumbai', aqi: 161 },
  { city: 'Nagpur', aqi: 166 },
  { city: 'Aurangabad', aqi: 134 },
];

// Real-time statistics
const realtimeStats = {
  citiesMonitored: 34,
  avgTemperature: 29.7,
  airQualityIndex: 115,
  vegetationIndex: 0.33,
  temperatureChange: 2,
  aqiChange: -8,
  vegetationChange: 3,
};

const StatCard = ({ title, value, unit, icon: Icon, change, changeType }: any) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  
  return (
    <motion.div
      className="glass rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-white/10">
          <Icon className="w-6 h-6 text-eco-blue" />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
        }`}>
          {isPositive ? <TrendingUp size={16} /> : isNegative ? <TrendingDown size={16} /> : null}
          <span>{change}%</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-gray-300 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className="text-gray-400 text-sm">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};

const CityCard = ({ city }: { city: any }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'moderate': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'low': return 'bg-green-500/20 border-green-500/30 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <motion.div
      className="glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-lg">{city.name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs border ${getRiskColor(city.risk)}`}>
          {city.risk}
        </div>
      </div>
      
      <div className="text-sm text-gray-300 mb-3">{city.region} Maharashtra</div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer size={16} className="text-orange-400" />
            <span className="text-gray-300">Temp</span>
          </div>
          <span className="text-white font-medium">{city.temp}°C</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind size={16} className="text-blue-400" />
            <span className="text-gray-300">AQI</span>
          </div>
          <span className="text-white font-medium">{city.aqi}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf size={16} className="text-green-400" />
            <span className="text-gray-300">NDVI</span>
          </div>
          <span className="text-white font-medium">{city.ndvi}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-purple-400" />
            <span className="text-gray-300">Pop</span>
          </div>
          <span className="text-white font-medium">{city.population}</span>
        </div>
      </div>
    </motion.div>
  );
};

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
              Environmental Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Real-time monitoring across 34 Maharashtra cities</p>
          </div>
          <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">🤖 AI Assistant Active</span>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Cities Monitored"
          value={realtimeStats.citiesMonitored}
          unit=""
          icon={MapPin}
          change={5}
          changeType="positive"
        />
        <StatCard
          title="Avg Temperature"
          value={realtimeStats.avgTemperature}
          unit="°C"
          icon={Thermometer}
          change={realtimeStats.temperatureChange}
          changeType="negative"
        />
        <StatCard
          title="Air Quality"
          value={realtimeStats.airQualityIndex}
          unit="AQI"
          icon={Wind}
          change={Math.abs(realtimeStats.aqiChange)}
          changeType="positive"
        />
        <StatCard
          title="Vegetation Index"
          value={realtimeStats.vegetationIndex}
          unit=""
          icon={Leaf}
          change={realtimeStats.vegetationChange}
          changeType="positive"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-8">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'interactive', label: 'Interactive Map' },
          { id: '3d', label: '3D Earth View' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Temperature Trend Chart */}
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTemp" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Air Quality Bar Chart */}
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Air Quality Index by City</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aqiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="city" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="aqi" 
                  fill="#0EA5E9"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Cities Grid */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">City Monitoring</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {maharashtraCities.map((city, index) => (
                <CityCard key={city.name} city={city} />
              ))}
            </div>
          </motion.div>

          {/* Filter Panel */}
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Temperature Range (°C)</label>
                <div className="flex items-center space-x-2">
                  <span className="text-white">20°</span>
                  <div className="flex-1 h-2 bg-white/20 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-eco-blue to-eco-green rounded-full w-3/4"></div>
                  </div>
                  <span className="text-white">35°</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Air Quality Index</label>
                <div className="flex items-center space-x-2">
                  <span className="text-white">0</span>
                  <div className="flex-1 h-2 bg-white/20 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-eco-blue to-eco-green rounded-full w-2/3"></div>
                  </div>
                  <span className="text-white">200</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <span className="text-white">₹10L</span>
                  <div className="flex-1 h-2 bg-white/20 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-eco-blue to-eco-green rounded-full w-1/2"></div>
                  </div>
                  <span className="text-white">₹1Cr</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-gradient-to-r from-eco-blue to-eco-green py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300">
              Reset
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;