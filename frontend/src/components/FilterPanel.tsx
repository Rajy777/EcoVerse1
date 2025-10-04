import React from 'react';
import { motion } from 'framer-motion';
import { X, Thermometer, Wind, Droplets, IndianRupee } from 'lucide-react';

interface FilterPanelProps {
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Temperature Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Thermometer className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-medium">Temperature Range (°C)</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">20°</span>
              <div className="flex-1 h-2 bg-white/20 rounded-full relative">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-3/4"></div>
                <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                <div className="absolute left-3/4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
              <span className="text-white text-sm">35°</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Min: 25°C</span>
              <span>Max: 32°C</span>
            </div>
          </div>

          {/* Air Quality Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Wind className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-medium">Air Quality Index</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">0</span>
              <div className="flex-1 h-2 bg-white/20 rounded-full relative">
                <div className="h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full w-2/3"></div>
                <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                <div className="absolute left-2/3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
              <span className="text-white text-sm">200</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Min: 50 AQI</span>
              <span>Max: 150 AQI</span>
            </div>
          </div>

          {/* Vegetation Index Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Droplets className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-medium">Vegetation Index (NDVI)</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">0.1</span>
              <div className="flex-1 h-2 bg-white/20 rounded-full relative">
                <div className="h-2 bg-gradient-to-r from-yellow-600 to-green-500 rounded-full w-1/2"></div>
                <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
              <span className="text-white text-sm">0.8</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Min: 0.2</span>
              <span>Max: 0.5</span>
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <IndianRupee className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-medium">Price Range</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">₹10L</span>
              <div className="flex-1 h-2 bg-white/20 rounded-full relative">
                <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-3/5"></div>
                <div className="absolute left-1/3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                <div className="absolute left-3/5 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
              <span className="text-white text-sm">₹1Cr</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Min: ₹25L</span>
              <span>Max: ₹60L</span>
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <h3 className="text-white font-medium mb-3">Maharashtra Regions</h3>
            <div className="space-y-2">
              {[
                { name: 'Western Maharashtra', count: 8 },
                { name: 'Vidarbha', count: 11 },
                { name: 'Marathwada', count: 8 },
                { name: 'Konkan', count: 7 },
              ].map((region) => (
                <label key={region.name} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-eco-blue bg-transparent border-2 border-gray-400 rounded focus:ring-eco-blue focus:ring-2"
                    defaultChecked
                  />
                  <span className="text-gray-300 flex-1">{region.name}</span>
                  <span className="text-gray-500 text-sm">({region.count})</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors">
            Reset
          </button>
          <button className="flex-1 bg-gradient-to-r from-eco-blue to-eco-green py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300">
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterPanel;