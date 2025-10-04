import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icons for different zone types
const createIcon = (color: string, symbol: string) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${symbol}</div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const hotspotIcon = createIcon('#FF4444', '🔥');
const parkIcon = createIcon('#228B22', '🌳');
const clinicIcon = createIcon('#0066CC', '🏥');

interface Zone {
  id: string;
  name: string;
  type: string;
  coordinates: { lat: number; lng: number };
  population: number;
  lst: number;
  ndvi: number;
  analysis?: {
    hotspot: {
      category: string;
      priority: string;
      temperatureDifferential: number;
      coolingPotential: number;
    };
    parkRecommendation: {
      category: string;
      parkType: string;
      treesNeeded: number;
      projectedCooling: number;
    };
    clinicRecommendation: {
      clinicType: string;
      priority: string;
      capacity: number;
    };
    overallPriority: string;
  };
}

interface ZoneAnalysisProps {
  cityName: string;
}

const ZoneAnalysis: React.FC<ZoneAnalysisProps> = ({ cityName }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [analysisType, setAnalysisType] = useState<'hotspots' | 'parks' | 'clinics' | 'overview'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchZoneAnalysis();
  }, [cityName, analysisType]);

  const fetchZoneAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/analysis/city/${cityName.toLowerCase()}`);
      if (!response.ok) throw new Error('Failed to fetch zone analysis');
      
      const data = await response.json();
      setZones(data.zones || []);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getZoneColor = (zone: Zone) => {
    if (!zone.analysis) return '#888888';
    
    switch (analysisType) {
      case 'hotspots':
        switch (zone.analysis.hotspot.priority) {
          case 'critical': return '#FF0000';
          case 'high': return '#FF6600';
          case 'medium': return '#FFAA00';
          default: return '#00AA00';
        }
      case 'parks':
        switch (zone.analysis.parkRecommendation.category) {
          case 'highest-priority': return '#00AA00';
          case 'high-priority': return '#66BB00';
          case 'medium-priority': return '#AACC00';
          case 'low-priority': return '#DDDD00';
          default: return '#CCCCCC';
        }
      case 'clinics':
        switch (zone.analysis.clinicRecommendation.priority) {
          case 'critical': return '#0000FF';
          case 'high': return '#3366FF';
          case 'medium': return '#6699FF';
          default: return '#99CCFF';
        }
      default:
        switch (zone.analysis.overallPriority) {
          case 'critical': return '#FF0000';
          case 'high': return '#FF6600';
          case 'medium': return '#FFAA00';
          default: return '#00AA00';
        }
    }
  };

  const getIcon = (zone: Zone) => {
    if (!zone.analysis) return hotspotIcon;
    
    switch (analysisType) {
      case 'hotspots':
        return zone.analysis.hotspot.priority !== 'low' ? hotspotIcon : null;
      case 'parks':
        return zone.analysis.parkRecommendation.category !== 'not-recommended' ? parkIcon : null;
      case 'clinics':
        return zone.analysis.clinicRecommendation.priority !== 'not-needed' ? clinicIcon : null;
      default:
        if (zone.analysis.overallPriority === 'critical') return hotspotIcon;
        if (zone.analysis.parkRecommendation.category.includes('priority')) return parkIcon;
        if (zone.analysis.clinicRecommendation.priority !== 'not-needed') return clinicIcon;
        return null;
    }
  };

  const renderPopupContent = (zone: Zone) => {
    if (!zone.analysis) return <div>No analysis data</div>;
    
    return (
      <div className="zone-popup">
        <h3 className="text-lg font-bold text-gray-800">{zone.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{zone.type.replace(/-/g, ' ')}</p>
        
        <div className="space-y-2 text-sm">
          <div className="bg-red-50 p-2 rounded">
            <strong>🔥 Hotspot Analysis:</strong>
            <br />Category: {zone.analysis.hotspot.category.replace(/-/g, ' ')}
            <br />Temperature: +{zone.analysis.hotspot.temperatureDifferential}°C above city avg
            <br />Cooling Potential: {zone.analysis.hotspot.coolingPotential}°C
          </div>
          
          <div className="bg-green-50 p-2 rounded">
            <strong>🌳 Park Recommendation:</strong>
            <br />Type: {zone.analysis.parkRecommendation.parkType.replace(/-/g, ' ')}
            <br />Trees Needed: {zone.analysis.parkRecommendation.treesNeeded}
            <br />Projected Cooling: {zone.analysis.parkRecommendation.projectedCooling}°C
          </div>
          
          <div className="bg-blue-50 p-2 rounded">
            <strong>🏥 Clinic Recommendation:</strong>
            <br />Type: {zone.analysis.clinicRecommendation.clinicType.replace(/-/g, ' ')}
            <br />Capacity: {zone.analysis.clinicRecommendation.capacity} beds
            <br />Priority: {zone.analysis.clinicRecommendation.priority}
          </div>
          
          <div className="bg-gray-50 p-2 rounded">
            <strong>📊 Zone Stats:</strong>
            <br />Population: {zone.population.toLocaleString()}
            <br />Temperature: {zone.lst}°C
            <br />Vegetation Index: {zone.ndvi}
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-bold mb-3">{cityName} Analysis Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-red-50 p-3 rounded">
            <h4 className="font-semibold text-red-800 mb-2">🔥 Hotspots</h4>
            <div>Extreme: {summary.hotspots.extreme}</div>
            <div>Severe: {summary.hotspots.severe}</div>
            <div>Moderate: {summary.hotspots.moderate}</div>
            <div>Mild: {summary.hotspots.mild}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <h4 className="font-semibold text-green-800 mb-2">🌳 Park Recommendations</h4>
            <div>Highest Priority: {summary.parkRecommendations.highest}</div>
            <div>High Priority: {summary.parkRecommendations.high}</div>
            <div>Medium Priority: {summary.parkRecommendations.medium}</div>
            <div>Low Priority: {summary.parkRecommendations.low}</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">🏥 Healthcare Recommendations</h4>
            <div>Regional Hospitals: {summary.clinicRecommendations.regional}</div>
            <div>Specialty Clinics: {summary.clinicRecommendations.specialty}</div>
            <div>Primary Centers: {summary.clinicRecommendations.primary}</div>
            <div>Community Posts: {summary.clinicRecommendations.community}</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p>Analyzing {cityName} zones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Analysis Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchZoneAnalysis}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  const cityCenter: LatLngExpression = zones.length > 0 
    ? [zones[0].coordinates.lat, zones[0].coordinates.lng]
    : [19.0760, 72.8777]; // Default to Mumbai

  return (
    <div className="w-full h-full">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-bold mb-3">Zone Analysis: {cityName}</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {(['overview', 'hotspots', 'parks', 'clinics'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setAnalysisType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                analysisType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'overview' && '🗺️ Overview'}
              {type === 'hotspots' && '🔥 Heat Islands'}
              {type === 'parks' && '🌳 Green Spaces'}
              {type === 'clinics' && '🏥 Healthcare'}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          Showing: <strong>{zones.length}</strong> zones with advanced NASA MODIS-based analysis
        </div>
      </div>
      
      {/* Summary */}
      {renderSummary()}
      
      {/* Map */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={cityCenter}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container-dark"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {zones.map((zone) => {
            const icon = getIcon(zone);
            const color = getZoneColor(zone);
            
            return (
              <React.Fragment key={zone.id}>
                {/* Zone circle representing area and intensity */}
                <Circle
                  center={[zone.coordinates.lat, zone.coordinates.lng]}
                  radius={zone.population / 100} // Scale radius based on population
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.3,
                    color: color,
                    weight: 2
                  }}
                />
                
                {/* Icon marker for specific analysis type */}
                {icon && (
                  <Marker
                    position={[zone.coordinates.lat, zone.coordinates.lng]}
                    icon={icon}
                  >
                    <Popup maxWidth={400} className="zone-analysis-popup">
                      {renderPopupContent(zone)}
                    </Popup>
                  </Marker>
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h4 className="font-semibold mb-2">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {analysisType === 'hotspots' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>Critical Hotspots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Moderate Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Normal Zones</span>
              </div>
            </>
          )}
          
          {analysisType === 'parks' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>Highest Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span>Not Recommended</span>
              </div>
            </>
          )}
          
          {analysisType === 'clinics' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-800 rounded"></div>
                <span>Regional Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Specialty Clinic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span>Primary Center</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                <span>Community Post</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZoneAnalysis;