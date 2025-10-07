import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface CityData {
  id: number;
  name: string;
  coordinates: { lat: number; lng: number };
  data: {
    temperature: number;
    aqi: number;
    ndvi: number;
    population: string;
    risk: 'low' | 'moderate' | 'high';
  };
}

interface EnvironmentalMapProps {
  cities: CityData[];
  insights?: any[];
  focusCity?: any;
}

const EnvironmentalMap: React.FC<EnvironmentalMapProps> = ({ cities = [], insights = [], focusCity }) => {
  const [activeMetric, setActiveMetric] = useState<'temperature' | 'aqi' | 'ndvi'>('aqi');
  
  // Ensure cities is an array
  const safeCities = Array.isArray(cities) ? cities : [];

  const getMarkerColor = (city: CityData, metric: string) => {
    const value = city.data[metric as keyof typeof city.data];
    
    switch (metric) {
      case 'temperature':
        if (value > 35) return '#EF4444'; // Red for high temp
        if (value > 30) return '#F97316'; // Orange for medium temp
        return '#10B981'; // Green for low temp
      case 'aqi':
        if (value > 150) return '#EF4444'; // Red for poor air quality
        if (value > 100) return '#F97316'; // Orange for moderate
        return '#10B981'; // Green for good air quality
      case 'ndvi':
        if (value > 0.4) return '#10B981'; // Green for high vegetation
        if (value > 0.25) return '#F97316'; // Orange for medium vegetation
        return '#EF4444'; // Red for low vegetation
      default:
        return '#3B82F6';
    }
  };

  const getMarkerSize = (city: CityData, metric: string) => {
    const value = city.data[metric as keyof typeof city.data] as number;
    
    switch (metric) {
      case 'temperature':
        return Math.max(8, (value / 40) * 25);
      case 'aqi':
        return Math.max(8, (value / 200) * 25);
      case 'ndvi':
        return Math.max(8, value * 50);
      default:
        return 15;
    }
  };

  const getMetricValue = (city: CityData, metric: string) => {
    const value = city.data[metric as keyof typeof city.data];
    switch (metric) {
      case 'temperature':
        return `${value}°C`;
      case 'aqi':
        return `AQI: ${value}`;
      case 'ndvi':
        return `NDVI: ${value}`;
      default:
        return value;
    }
  };

  // Determine map center and zoom based on focusCity
  const maharashtraCenter: [number, number] = [19.7515, 75.7139];
  const mapCenter: [number, number] = focusCity ? 
    [focusCity.coordinates.lat, focusCity.coordinates.lng] : maharashtraCenter;
  const mapZoom = focusCity ? 10 : 7;

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">
          {focusCity ? `${focusCity.name} - Environmental Data` : 'Environmental Data Map'}
        </h3>
        
        {/* Metric selector */}
        <div className="flex space-x-2">
          {[
            { key: 'temperature', label: 'Temperature', icon: '🌡️' },
            { key: 'aqi', label: 'Air Quality', icon: '💨' },
            { key: 'ndvi', label: 'Vegetation', icon: '🌿' }
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => setActiveMetric(metric.key as any)}
              className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 flex items-center space-x-1 ${
                activeMetric === metric.key
                  ? 'bg-eco-blue text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
              }`}
            >
              <span>{metric.icon}</span>
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          key={focusCity ? focusCity.name : 'general'}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {safeCities.map((city, index) => (
            <CircleMarker
              key={city.id || index}
              center={[city.coordinates.lat, city.coordinates.lng]}
              radius={getMarkerSize(city, activeMetric)}
              pathOptions={{
                color: getMarkerColor(city, activeMetric),
                fillColor: getMarkerColor(city, activeMetric),
                fillOpacity: 0.7,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-gray-900 p-2">
                  <h4 className="font-bold text-lg">{city.name}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-medium">{city.data.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AQI:</span>
                      <span className="font-medium">{city.data.aqi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NDVI:</span>
                      <span className="font-medium">{city.data.ndvi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Population:</span>
                      <span className="font-medium">{city.data.population}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className={`font-medium capitalize ${
                        city.data.risk === 'high' ? 'text-red-600' :
                        city.data.risk === 'moderate' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {city.data.risk}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          
          {/* Show insight locations if available */}
          {insights.map((insight, index) => (
            insight.coordinates && (
              <Marker
                key={`insight-${index}`}
                position={[insight.coordinates.lat, insight.coordinates.lng]}
                icon={L.divIcon({
                  html: `<div style="background: rgba(59, 130, 246, 0.8); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">!</div>`,
                  iconSize: [24, 24],
                  className: 'custom-insight-marker'
                })}
              >
                <Popup>
                  <div className="text-gray-900 p-2">
                    <h4 className="font-bold">{insight.title}</h4>
                    <p className="text-sm mt-1">{insight.message}</p>
                    <div className="mt-2 text-xs text-gray-600">
                      Confidence: {insight.confidence}%
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          Showing: <span className="text-white font-medium">{activeMetric.toUpperCase()}</span> data
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalMap;