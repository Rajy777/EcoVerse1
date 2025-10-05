import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Thermometer, Wind, Droplets, Users, Calendar, TrendingUp } from 'lucide-react';

interface CitySearchProps {
  onCitySelect: (city: any) => void;
}

interface SearchResult {
  name: string;
  state: string;
  region: string;
  coordinates: { lat: number; lng: number };
  data: {
    temperature: number;
    aqi: number;
    ndvi: number;
    risk: string;
  };
  population: number;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/cities/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCityClick = async (city: SearchResult) => {
    setQuery(city.name);
    setShowResults(false);
    setIsLoading(true);

    try {
      // Fetch detailed city data
      const detailResponse = await fetch(`http://localhost:5000/api/cities/${city.name.toLowerCase()}`);
      if (detailResponse.ok) {
        const detailedCity = await detailResponse.json();
        setSelectedCity(detailedCity);
        onCitySelect(detailedCity);

        // Fetch historical data for multiple parameters
        const historicalPromises = ['temperature', 'aqi', 'ndvi'].map(async (param) => {
          const histResponse = await fetch(`http://localhost:5000/api/cities/${city.name.toLowerCase()}/historical/${param}?days=30`);
          if (histResponse.ok) {
            const histData = await histResponse.json();
            return { parameter: param, data: histData };
          }
          return null;
        });

        const historicalResults = await Promise.all(historicalPromises);
        const historicalObj: any = {};
        historicalResults.filter(Boolean).forEach(result => {
          if (result) {
            historicalObj[result.parameter] = result.data;
          }
        });
        setHistoricalData(historicalObj);
      }
    } catch (error) {
      console.error('Error fetching city details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-300 bg-red-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'moderate': return 'text-orange-400 bg-orange-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 10000000) return `${(pop / 10000000).toFixed(1)}Cr`;
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
    if (pop >= 100000) return `${(pop / 100000).toFixed(1)}L`;
    return pop.toLocaleString();
  };

  return (
    <div className="w-full max-w-2xl mx-auto" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            placeholder="Search for any Indian city (e.g., Mumbai, Delhi, Bangalore)..."
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-eco-blue focus:ring-2 focus:ring-eco-blue/50 focus:outline-none transition-all duration-300"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-eco-blue"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
            >
              {results.map((city, index) => (
                <motion.div
                  key={`${city.name}-${city.state}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCityClick(city)}
                  className="p-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-semibold">{city.name}</h3>
                        <span className="text-gray-400 text-sm">{city.state}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(city.data.risk)}`}>
                          {city.data.risk}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{city.region}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{formatPopulation(city.population)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-orange-400">
                          <Thermometer className="w-3 h-3" />
                          <span>{city.data.temperature}°C</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-blue-400">
                          <Wind className="w-3 h-3" />
                          <span>{city.data.aqi}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-green-400">
                          <Droplets className="w-3 h-3" />
                          <span>{city.data.ndvi}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {showResults && results.length === 0 && !isLoading && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-white/20 rounded-xl p-4 z-50"
          >
            <p className="text-gray-400 text-center">No cities found for "{query}"</p>
          </motion.div>
        )}
      </div>

      {/* Selected City Details */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedCity.name}</h2>
                <div className="flex items-center space-x-4 text-gray-300">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedCity.state}, {selectedCity.region} India</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formatPopulation(selectedCity.population)} people</span>
                  </span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full ${getRiskColor(selectedCity.data.risk)}`}>
                {selectedCity.data.risk.charAt(0).toUpperCase() + selectedCity.data.risk.slice(1)} Risk
              </div>
            </div>

            {/* Environmental Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">Temperature</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {selectedCity.data.temperature}°C
                </div>
                {selectedCity.nasaData && (
                  <div className="text-sm text-gray-400 mt-1">
                    NASA: {selectedCity.nasaData.temperature.temperature.toFixed(1)}°C
                  </div>
                )}
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Wind className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">Air Quality</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {selectedCity.data.aqi} AQI
                </div>
                {selectedCity.nasaData && (
                  <div className="text-sm text-gray-400 mt-1">
                    NASA: {selectedCity.nasaData.airQuality.aqi} AQI
                  </div>
                )}
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Vegetation</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {selectedCity.data.ndvi.toFixed(2)} NDVI
                </div>
                {selectedCity.nasaData && (
                  <div className="text-sm text-gray-400 mt-1">
                    NASA: {selectedCity.nasaData.ndvi.ndvi.toFixed(2)} NDVI
                  </div>
                )}
              </div>
            </div>

            {/* Historical Data Preview */}
            {historicalData && (
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-eco-blue" />
                  <h3 className="text-lg font-semibold text-white">30-Day Trends</h3>
                  <span className="flex items-center space-x-1 text-sm text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {new Date().toLocaleDateString()}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(historicalData).map(([param, data]: [string, any]) => (
                    <div key={param} className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-300 capitalize mb-2">{param}</div>
                      <div className="text-xs text-gray-400">
                        {data.data ? `${data.data.length} data points` : 'No data available'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitySearch;