import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  MapPin, Thermometer, Wind, Droplets, Leaf, TrendingUp, TrendingDown,
  Users, Building, Car, Factory, Filter, Search, BarChart3
} from 'lucide-react';
import FilterPanel from './FilterPanel';
import CitySearch from './CitySearch';
import CityDashboard from './CityDashboard';

// Pan-India city data - comprehensive coverage across regions
const indianCities = [
  // Northern India
  { name: 'Delhi', region: 'Northern', temp: 42.8, aqi: 165, ndvi: 0.20, population: '32M', risk: 'critical' },
  
  // Western India  
  { name: 'Mumbai', region: 'Western', temp: 36.9, aqi: 161, ndvi: 0.26, population: '20M', risk: 'high' },
  { name: 'Pune', region: 'Western', temp: 30.2, aqi: 98, ndvi: 0.39, population: '6M', risk: 'low' },
  { name: 'Ahmedabad', region: 'Western', temp: 38.4, aqi: 152, ndvi: 0.28, population: '8M', risk: 'high' },
  
  // Southern India
  { name: 'Bangalore', region: 'Southern', temp: 26.5, aqi: 95, ndvi: 0.38, population: '12M', risk: 'low' },
  { name: 'Chennai', region: 'Southern', temp: 34.2, aqi: 148, ndvi: 0.21, population: '10M', risk: 'high' },
  { name: 'Hyderabad', region: 'Southern', temp: 32.8, aqi: 125, ndvi: 0.33, population: '9M', risk: 'moderate' },
  
  // Eastern India
  { name: 'Kolkata', region: 'Eastern', temp: 32.4, aqi: 142, ndvi: 0.32, population: '14M', risk: 'high' },
  { name: 'Bhubaneswar', region: 'Eastern', temp: 31.9, aqi: 118, ndvi: 0.41, population: '1M', risk: 'moderate' },
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

// Air Quality Index data - Pan-India cities
const aqiData = [
  { city: 'Bangalore', aqi: 95 },
  { city: 'Pune', aqi: 98 },
  { city: 'Bhubaneswar', aqi: 118 },
  { city: 'Hyderabad', aqi: 125 },
  { city: 'Kolkata', aqi: 142 },
  { city: 'Chennai', aqi: 148 },
  { city: 'Ahmedabad', aqi: 152 },
  { city: 'Mumbai', aqi: 161 },
  { city: 'Delhi', aqi: 165 },
];

// Real-time statistics - Pan-India
const realtimeStats = {
  citiesMonitored: 47,
  avgTemperature: 33.2,
  airQualityIndex: 133,
  vegetationIndex: 0.31,
  temperatureChange: 3,
  aqiChange: -5,
  vegetationChange: 2,
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
      case 'critical': return 'bg-red-600/30 border-red-600/40 text-red-300';
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
      
      <div className="text-sm text-gray-300 mb-3">{city.region} India</div>
      
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

// Filter settings interface
interface FilterSettings {
  region: string;
  tempMin: number;
  tempMax: number;
  aqiMin: number;
  aqiMax: number;
  ndviMin: number;
  ndviMax: number;
  risk: string;
}

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [allCities, setAllCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterSettings>({
    region: 'all',
    tempMin: 20,
    tempMax: 45,
    aqiMin: 0,
    aqiMax: 300,
    ndviMin: 0.1,
    ndviMax: 0.8,
    risk: 'all'
  });

  // Fetch all cities on component mount
  useEffect(() => {
    fetchAllCities();
  }, []);

  // Apply filters when filter settings change
  useEffect(() => {
    applyFilters();
  }, [allCities, filters]);

  const fetchAllCities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/cities');
      if (response.ok) {
        const data = await response.json();
        setAllCities(data.cities);
        setFilteredCities(data.cities.slice(0, 9)); // Show first 9 cities initially
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = async () => {
    if (allCities.length === 0) return;

    try {
      const queryParams = new URLSearchParams();
      if (filters.region !== 'all') queryParams.set('region', filters.region);
      if (filters.tempMin > 20) queryParams.set('tempMin', filters.tempMin.toString());
      if (filters.tempMax < 45) queryParams.set('tempMax', filters.tempMax.toString());
      if (filters.aqiMin > 0) queryParams.set('aqiMin', filters.aqiMin.toString());
      if (filters.aqiMax < 300) queryParams.set('aqiMax', filters.aqiMax.toString());
      if (filters.ndviMin > 0.1) queryParams.set('ndviMin', filters.ndviMin.toString());
      if (filters.ndviMax < 0.8) queryParams.set('ndviMax', filters.ndviMax.toString());
      if (filters.risk !== 'all') queryParams.set('risk', filters.risk);

      const response = await fetch(`http://localhost:5000/api/cities/filter?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredCities(data.cities);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleApplyFilters = (newFilters: FilterSettings) => {
    setFilters(newFilters);
  };

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    setActiveTab('city-detail');
  };

  // Update statistics based on filtered cities
  const getFilteredStats = () => {
    if (filteredCities.length === 0) return realtimeStats;
    
    const avgTemp = filteredCities.reduce((sum, city) => sum + city.data.temperature, 0) / filteredCities.length;
    const avgAQI = filteredCities.reduce((sum, city) => sum + city.data.aqi, 0) / filteredCities.length;
    const avgNDVI = filteredCities.reduce((sum, city) => sum + city.data.ndvi, 0) / filteredCities.length;
    
    return {
      citiesMonitored: filteredCities.length,
      avgTemperature: Math.round(avgTemp * 10) / 10,
      airQualityIndex: Math.round(avgAQI),
      vegetationIndex: Math.round(avgNDVI * 100) / 100,
      temperatureChange: 3,
      aqiChange: -5,
      vegetationChange: 2
    };
  };

  const currentStats = getFilteredStats();

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
              EcoVerse Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Real-time monitoring across {currentStats.citiesMonitored} major Indian cities
              {filteredCities.length < allCities.length && ` (${allCities.length - filteredCities.length} filtered out)`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilterPanel(true)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-white text-sm font-medium">Filters</span>
            </button>
            <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">🤖 AI + NASA Data</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* City Search */}
      <div className="mb-8">
        <CitySearch onCitySelect={handleCitySelect} />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Cities Monitored"
          value={currentStats.citiesMonitored}
          unit=""
          icon={MapPin}
          change={5}
          changeType="positive"
        />
        <StatCard
          title="Avg Temperature"
          value={currentStats.avgTemperature}
          unit="°C"
          icon={Thermometer}
          change={currentStats.temperatureChange}
          changeType="negative"
        />
        <StatCard
          title="Air Quality"
          value={currentStats.airQualityIndex}
          unit="AQI"
          icon={Wind}
          change={Math.abs(currentStats.aqiChange)}
          changeType="positive"
        />
        <StatCard
          title="Vegetation Index"
          value={currentStats.vegetationIndex}
          unit=""
          icon={Leaf}
          change={currentStats.vegetationChange}
          changeType="positive"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'city-detail', label: selectedCity ? `${selectedCity.name} Details` : 'City Details', icon: MapPin },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.id === 'city-detail' && !selectedCity}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            } ${tab.id === 'city-detail' && !selectedCity ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {activeTab === 'city-detail' && selectedCity ? (
        <CityDashboard city={selectedCity} />
      ) : (
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Cities Monitoring</h3>
              <span className="text-sm text-gray-400">
                {isLoading ? 'Loading...' : `${filteredCities.length} cities`}
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-blue"></div>
                </div>
              ) : (
                filteredCities.slice(0, 8).map((city, index) => (
                  <div key={city.name} onClick={() => handleCitySelect(city)} className="cursor-pointer">
                    <CityCard city={city} />
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>
      </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <FilterPanel
          onClose={() => setShowFilterPanel(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      )}
    </div>
  );
};

export default MainDashboard;