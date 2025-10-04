import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, MessageSquare, MapPin, BarChart3 as BarChart } from 'lucide-react';
import EnvironmentalMap from './EnvironmentalMap';
import ZoneAnalysis from './ZoneAnalysis';

// Mock data for insights
const cityComparison = [
  { city: 'Mumbai', score: 65, temperature: 31.9, aqi: 161, population: 12.4 },
  { city: 'Pune', score: 82, temperature: 27.8, aqi: 98, population: 3.1 },
  { city: 'Nagpur', score: 58, temperature: 38.4, aqi: 166, population: 2.4 },
  { city: 'Nashik', score: 74, temperature: 32.1, aqi: 142, population: 1.5 },
  { city: 'Thane', score: 68, temperature: 30.5, aqi: 155, population: 1.8 },
  { city: 'Aurangabad', score: 71, temperature: 35.2, aqi: 134, population: 1.2 },
];

const riskFactors = [
  { name: 'Heat Islands', value: 35, color: '#EF4444' },
  { name: 'Air Pollution', value: 28, color: '#F97316' },
  { name: 'Water Stress', value: 20, color: '#3B82F6' },
  { name: 'Green Cover Loss', value: 17, color: '#10B981' },
];

const aiInsights = [
  {
    id: 1,
    type: 'prediction',
    title: 'Temperature Alert',
    message: 'Based on current trends, Mumbai and Nagpur are likely to experience heat waves in the next 2 weeks. Recommend increasing green cover and water availability.',
    confidence: 87,
    priority: 'high'
  },
  {
    id: 2,
    type: 'recommendation',
    title: 'Air Quality Improvement',
    message: 'Pune shows the best air quality patterns. Implementing similar traffic management and industrial policies in other cities could reduce AQI by 15-20%.',
    confidence: 92,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'trend',
    title: 'Vegetation Recovery',
    message: 'NDVI values in Western Maharashtra have increased by 12% this season, indicating successful afforestation efforts. Continue current strategies.',
    confidence: 95,
    priority: 'low'
  }
];

const InsightCard = ({ insight }: { insight: any }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/10';
      case 'medium': return 'border-orange-500/30 bg-orange-500/10';
      case 'low': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <AlertTriangle className="w-5 h-5" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      className={`glass rounded-xl p-6 border ${getPriorityColor(insight.priority)} hover:bg-white/15 transition-all duration-300`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white/10">
            {getIcon(insight.type)}
          </div>
          <div>
            <h3 className="text-white font-semibold">{insight.title}</h3>
            <span className="text-xs text-gray-400 capitalize">{insight.type}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-eco-blue font-medium">{insight.confidence}%</div>
          <div className="text-xs text-gray-400">confidence</div>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm leading-relaxed">{insight.message}</p>
      
      <div className="flex items-center justify-between mt-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          insight.priority === 'high' ? 'bg-red-500/20 text-red-400' :
          insight.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {insight.priority} priority
        </span>
        <button className="text-eco-blue hover:text-eco-green text-sm font-medium">
          View Details →
        </button>
      </div>
    </motion.div>
  );
};

const InsightsPage = () => {
  const [activeInsight, setActiveInsight] = useState('all');
  const [activeView, setActiveView] = useState('charts'); // 'charts' or 'map' or 'zones'
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [insights, setInsights] = useState(aiInsights);
  const [backendInsights, setBackendInsights] = useState([]);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cities data
        const citiesResponse = await fetch('http://localhost:5000/api/cities');
        if (citiesResponse.ok) {
          const citiesData = await citiesResponse.json();
          setCities(citiesData);
        }

        // Fetch AI insights
        const insightsResponse = await fetch('http://localhost:5000/api/ai/insights');
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          setBackendInsights(insightsData.insights || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      setIsLoading(true);
      setChatResponse('');
      
      try {
        const response = await fetch('http://localhost:5000/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: chatMessage,
            context: 'Environmental data analysis for Maharashtra cities'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setChatResponse(data.response);
        } else {
          setChatResponse('Sorry, I encountered an error. Please try again.');
        }
      } catch (error) {
        console.error('AI Chat error:', error);
        setChatResponse('Unable to connect to AI service. Please ensure the backend is running.');
      } finally {
        setIsLoading(false);
        setChatMessage('');
      }
    }
  };

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
              AI-Powered Insights
            </h1>
            <p className="text-gray-400 text-lg">Advanced environmental analysis and predictions</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex space-x-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveView('charts')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                activeView === 'charts'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart size={18} />
              <span>Charts</span>
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                activeView === 'map'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin size={18} />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setActiveView('zones')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                activeView === 'zones'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Brain size={18} />
              <span>Zone Analysis</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeView === 'zones' ? (
            /* Zone Analysis View */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* City Selector */}
              <div className="glass rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Select City for Analysis</h3>
                <div className="flex flex-wrap gap-2">
                  {['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCity === city
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Zone Analysis Component */}
              <ZoneAnalysis cityName={selectedCity} />
            </motion.div>
          ) : activeView === 'map' ? (
            /* Map View */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EnvironmentalMap 
                cities={cities} 
                insights={backendInsights.length > 0 ? backendInsights : insights}
              />
            </motion.div>
          ) : (
            /* Charts View */
            <>
          {/* City Performance Chart */}
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">City Environmental Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={cityComparison}>
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
                <Bar dataKey="score" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Risk Analysis Pie Chart */}
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Environmental Risk Factors</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskFactors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskFactors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: factor.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{factor.name}</span>
                  <span className="text-white text-sm font-medium">{factor.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Chat Interface */}
          <motion.div
            className="glass rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-eco-blue" />
              <h3 className="text-xl font-semibold text-white">Ask AI Assistant</h3>
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div className="flex items-center space-x-2 ml-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">OpenAI GPT-4 Connected</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-4 min-h-32 max-h-64 overflow-y-auto">
              <div className="text-gray-400 text-sm mb-3">
                AI: Hello! I can help you analyze environmental data, predict trends, and provide insights about Maharashtra cities. What would you like to know?
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2 text-eco-blue">
                  <div className="w-4 h-4 border-2 border-eco-blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              )}
              {chatResponse && (
                <div className="mt-3 p-3 bg-white/10 rounded-lg">
                  <div className="text-white text-sm whitespace-pre-wrap">
                    AI: {chatResponse}
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="flex space-x-3">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about weather patterns, air quality, or environmental predictions..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-eco-blue"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-eco-blue to-eco-green hover:shadow-lg'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Predict next week's weather",
                "Best cities for air quality",
                "Heat island mitigation strategies",
                "Green cover recommendations"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setChatMessage(suggestion)}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-gray-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
            </>
          )}
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">AI Insights & Predictions</h3>
            
            {/* Filter buttons */}
            <div className="flex space-x-2 mb-6">
              {['all', 'prediction', 'recommendation', 'trend'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveInsight(type)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                    activeInsight === type
                      ? 'bg-eco-blue text-white'
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {(backendInsights.length > 0 ? backendInsights : insights)
                .filter(insight => activeInsight === 'all' || insight.type === activeInsight)
                .map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;