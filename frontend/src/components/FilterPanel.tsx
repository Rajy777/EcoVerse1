import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Thermometer, Wind, Droplets, MapPin } from 'lucide-react';

interface FilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: FilterSettings) => void;
  currentFilters: FilterSettings;
}

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

const FilterPanel: React.FC<FilterPanelProps> = ({ onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState<FilterSettings>(currentFilters);
  
  const handleSliderChange = (key: keyof FilterSettings, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSelectChange = (key: keyof FilterSettings, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };
  
  const handleReset = () => {
    const defaultFilters = {
      region: 'all',
      tempMin: 20,
      tempMax: 45,
      aqiMin: 0,
      aqiMax: 200,
      ndviMin: 0.1,
      ndviMax: 0.8,
      risk: 'all'
    };
    setFilters(defaultFilters);
  };
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
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Minimum: {filters.tempMin}°C</label>
                <input
                  type="range"
                  min="20"
                  max="45"
                  step="0.5"
                  value={filters.tempMin}
                  onChange={(e) => handleSliderChange('tempMin', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${(filters.tempMin - 20) / 25 * 100}%, rgba(255,255,255,0.2) ${(filters.tempMin - 20) / 25 * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Maximum: {filters.tempMax}°C</label>
                <input
                  type="range"
                  min="20"
                  max="45"
                  step="0.5"
                  value={filters.tempMax}
                  onChange={(e) => handleSliderChange('tempMax', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(filters.tempMax - 20) / 25 * 100}%, rgba(255,255,255,0.2) ${(filters.tempMax - 20) / 25 * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Air Quality Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Wind className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-medium">Air Quality Index</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Minimum: {filters.aqiMin} AQI</label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={filters.aqiMin}
                  onChange={(e) => handleSliderChange('aqiMin', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Maximum: {filters.aqiMax} AQI</label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  value={filters.aqiMax}
                  onChange={(e) => handleSliderChange('aqiMax', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Vegetation Index Filter */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Droplets className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-medium">Vegetation Index (NDVI)</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Minimum: {filters.ndviMin.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.01"
                  value={filters.ndviMin}
                  onChange={(e) => handleSliderChange('ndviMin', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Maximum: {filters.ndviMax.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.01"
                  value={filters.ndviMax}
                  onChange={(e) => handleSliderChange('ndviMax', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>


          {/* Region Filter */}
          <div>
            <h3 className="text-white font-medium mb-3">Indian Regions</h3>
            <select 
              value={filters.region} 
              onChange={(e) => handleSelectChange('region', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-eco-blue focus:ring-1 focus:ring-eco-blue mb-2"
            >
              <option value="all" className="bg-gray-800">All Regions</option>
              <option value="Northern" className="bg-gray-800">Northern India</option>
              <option value="Western" className="bg-gray-800">Western India</option>
              <option value="Southern" className="bg-gray-800">Southern India</option>
              <option value="Eastern" className="bg-gray-800">Eastern India</option>
              <option value="Central" className="bg-gray-800">Central India</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-8">
          <button 
            onClick={handleReset}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-eco-blue to-eco-green py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterPanel;