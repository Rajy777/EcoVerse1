import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Thermometer, Wind, Leaf, Users, X } from 'lucide-react';

interface InsightsCitySearchProps {
  onCitySelect: (city: any) => void;
  selectedCity: any;
  onClear: () => void;
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

const InsightsCitySearch: React.FC<InsightsCitySearchProps> = ({ onCitySelect, selectedCity, onClear }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
    setQuery('');
    setShowResults(false);
    setIsLoading(true);

    try {
      // Fetch detailed city data
      const detailResponse = await fetch(`http://localhost:5000/api/cities/${city.name.toLowerCase()}`);
      if (detailResponse.ok) {
        const detailedCity = await detailResponse.json();
        onCitySelect(detailedCity);
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

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onClear();
  };

  return (
    <div className="w-full" ref={searchRef}>
      {/* Selected City Display */}
      {selectedCity && !query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-white/10 border border-white/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-eco-blue" />
              <div>
                <h3 className="text-white font-semibold">{selectedCity.name}</h3>
                <p className="text-gray-300 text-sm">{selectedCity.state}, {selectedCity.region}</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-orange-400 text-sm">
                <Thermometer className="w-3 h-3" />
                <span>{selectedCity.data.temperature}°C</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-blue-400 text-sm">
                <Wind className="w-3 h-3" />
                <span>{selectedCity.data.aqi}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-green-400 text-sm">
                <Leaf className="w-3 h-3" />
                <span>{selectedCity.data.ndvi.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-purple-400 text-sm">
                <Users className="w-3 h-3" />
                <span>{formatPopulation(selectedCity.population)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Input */}
      {!selectedCity && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowResults(true)}
              placeholder="Search for a specific city for analysis..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-eco-blue focus:ring-2 focus:ring-eco-blue/50 focus:outline-none transition-all duration-300"
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
                className="absolute top-full left-0 right-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
              >
                {results.slice(0, 6).map((city, index) => (
                  <motion.div
                    key={`${city.name}-${city.state}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCityClick(city)}
                    className="p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-medium">{city.name}</h3>
                          <span className="text-gray-400 text-xs">{city.state}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(city.data.risk)}`}>
                            {city.data.risk}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">{city.region} India</div>
                      </div>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-orange-400">{city.data.temperature}°C</span>
                        <span className="text-blue-400">{city.data.aqi}</span>
                        <span className="text-green-400">{city.data.ndvi.toFixed(2)}</span>
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
              <p className="text-gray-400 text-center text-sm">No cities found for "{query}"</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Search Prompt */}
      {!selectedCity && !query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Search for City-Specific Analysis</h3>
          <p className="text-gray-400 text-sm">
            Enter a city name to get detailed zone analysis and environmental mapping
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default InsightsCitySearch;