import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  Thermometer, Wind, Droplets, Calendar, TrendingUp, TrendingDown, 
  MapPin, Users, Building, Leaf, Sun, Cloud, CloudRain, Eye
} from 'lucide-react';

interface CityDashboardProps {
  city: any;
}

const CityDashboard: React.FC<CityDashboardProps> = ({ city }) => {
  const [historicalData, setHistoricalData] = useState<any>({});
  const [selectedTimeRange, setSelectedTimeRange] = useState<number>(30);
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (city) {
      fetchHistoricalData();
    }
  }, [city, selectedTimeRange]);

  const fetchHistoricalData = async () => {
    if (!city) return;
    
    setIsLoading(true);
    try {
      const parameters = ['temperature', 'aqi', 'ndvi', 'precipitation'];
      const promises = parameters.map(async (param) => {
        const response = await fetch(`http://localhost:5000/api/cities/${city.name.toLowerCase()}/historical/${param}?days=${selectedTimeRange}`);
        if (response.ok) {
          const data = await response.json();
          return { parameter: param, ...data };
        }
        return null;
      });

      const results = await Promise.all(promises);
      const dataObj: any = {};
      results.filter(Boolean).forEach(result => {
        if (result) {
          dataObj[result.parameter] = result;
        }
      });
      setHistoricalData(dataObj);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'moderate': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatPopulation = (pop: number) => {
    if (pop >= 10000000) return `${(pop / 10000000).toFixed(1)}Cr`;
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
    if (pop >= 100000) return `${(pop / 100000).toFixed(1)}L`;
    return pop.toLocaleString();
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white font-medium">
              {`${entry.name}: ${entry.value}${getUnit(entry.dataKey)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getUnit = (metric: string) => {
    switch (metric) {
      case 'temperature': return '°C';
      case 'aqi': return ' AQI';
      case 'ndvi': return '';
      case 'precipitation': return 'mm';
      default: return '';
    }
  };

  // Environmental risk radar data
  const radarData = [
    { subject: 'Temperature', A: city?.data.temperature || 0, fullMark: 50 },
    { subject: 'Air Quality', A: city?.data.aqi ? Math.min(city.data.aqi / 4, 50) : 0, fullMark: 50 },
    { subject: 'Vegetation', A: city?.data.ndvi ? city.data.ndvi * 50 : 0, fullMark: 50 },
    { subject: 'Population Density', A: city?.population ? Math.min(city.population / 1000000 * 10, 50) : 0, fullMark: 50 },
    { subject: 'Urbanization', A: 35, fullMark: 50 },
    { subject: 'Climate Risk', A: city?.data.risk === 'critical' ? 45 : city?.data.risk === 'high' ? 35 : city?.data.risk === 'moderate' ? 25 : 15, fullMark: 50 }
  ];

  // Air quality breakdown pie chart data
  const aqiBreakdown = city?.nasaData?.airQuality ? [
    { name: 'PM2.5', value: city.nasaData.airQuality.pm25 || 0, color: '#ef4444' },
    { name: 'PM10', value: city.nasaData.airQuality.pm10 || 0, color: '#f97316' },
    { name: 'NO2', value: city.nasaData.airQuality.no2 || 0, color: '#f59e0b' },
    { name: 'SO2', value: city.nasaData.airQuality.so2 || 0, color: '#06b6d4' },
    { name: 'CO', value: (city.nasaData.airQuality.co || 0) * 10, color: '#8b5cf6' },
    { name: 'O3', value: city.nasaData.airQuality.o3 || 0, color: '#10b981' }
  ] : [];

  if (!city) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Select a city to view detailed dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* City Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/40 to-green-900/40 rounded-2xl p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{city.name}</h1>
            <div className="flex items-center space-x-6 text-gray-300 mb-4">
              <span className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{city.state}, {city.region} India</span>
              </span>
              <span className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{formatPopulation(city.population)} people</span>
              </span>
              <span className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>{city.area} km²</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-white font-medium`} style={{ backgroundColor: getRiskColor(city.data.risk) }}>
                {city.data.risk.charAt(0).toUpperCase() + city.data.risk.slice(1)} Risk
              </div>
              <span className="text-gray-400">
                Coordinates: {city.coordinates.lat.toFixed(4)}, {city.coordinates.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="w-8 h-8 text-orange-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{city.data.temperature}°C</div>
              <div className="text-sm text-gray-400">Temperature</div>
            </div>
          </div>
          {city.nasaData && (
            <div className="text-xs text-gray-400">
              NASA: {city.nasaData.temperature.temperature.toFixed(1)}°C
              <br />Night: {city.nasaData.temperature.temperatureNight.toFixed(1)}°C
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Wind className="w-8 h-8 text-blue-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{city.data.aqi}</div>
              <div className="text-sm text-gray-400">AQI</div>
            </div>
          </div>
          {city.nasaData && (
            <div className="text-xs text-gray-400">
              NASA: {city.nasaData.airQuality.aqi} AQI
              <br />PM2.5: {city.nasaData.airQuality.pm25.toFixed(1)} μg/m³
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Droplets className="w-8 h-8 text-green-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{city.data.ndvi.toFixed(2)}</div>
              <div className="text-sm text-gray-400">NDVI</div>
            </div>
          </div>
          {city.nasaData && (
            <div className="text-xs text-gray-400">
              NASA: {city.nasaData.ndvi.ndvi.toFixed(2)}
              <br />Quality: {city.nasaData.ndvi.quality}
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <CloudRain className="w-8 h-8 text-cyan-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{city.data.rainfall}</div>
              <div className="text-sm text-gray-400">mm/year</div>
            </div>
          </div>
          {city.nasaData && (
            <div className="text-xs text-gray-400">
              NASA: {city.nasaData.precipitation.totalRainfall.toFixed(0)}mm
              <br />Annual Average
            </div>
          )}
        </motion.div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Historical Trends</h2>
        <div className="flex items-center space-x-2">
          {[7, 30, 90, 365].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeRange === days
                  ? 'bg-eco-blue text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {days === 7 ? '7D' : days === 30 ? '30D' : days === 90 ? '3M' : '1Y'}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temperature Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Thermometer className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Temperature Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData.temperature?.data || []}>
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#temperatureGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AQI Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Wind className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Air Quality Index</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData.aqi?.data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* NDVI Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Leaf className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Vegetation Health (NDVI)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData.ndvi?.data || []}>
              <defs>
                <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#ndviGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Environmental Risk Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Environmental Risk Profile</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <PolarRadiusAxis angle={0} domain={[0, 50]} tick={false} />
              <Radar
                name="Risk Level"
                dataKey="A"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Air Quality Breakdown */}
      {city.nasaData?.airQuality && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Wind className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Air Quality Components</h3>
            <span className="text-sm text-gray-400 ml-4">μg/m³</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={aqiBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {aqiBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {aqiBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-300">{item.value.toFixed(1)} μg/m³</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Monthly Climate Patterns */}
      {city.nasaData?.precipitation?.monthlyData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Monthly Precipitation Pattern</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={city.nasaData.precipitation.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                tickFormatter={(value) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][value - 1]}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                labelFormatter={(value) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][value - 1]}
                formatter={(value) => [`${value} mm`, 'Rainfall']}
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="rainfall" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default CityDashboard;