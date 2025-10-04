import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, MapPin, Brain, Users, Target, Zap } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Satellite,
      title: 'Space Data Integration',
      description: 'Real-time satellite imagery and environmental data from NASA, ESA, and ISRO satellites for comprehensive monitoring.'
    },
    {
      icon: MapPin,
      title: '34 Cities Coverage',
      description: 'Complete monitoring across all major cities in Maharashtra with detailed environmental metrics and trends.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms provide predictions, recommendations, and actionable insights for city planning.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Collaborative platform connecting urban planners, local leaders, and citizens for sustainable city development.'
    },
    {
      icon: Target,
      title: 'Precision Analysis',
      description: 'Hexagonal grid system provides precise location-based analysis for heat islands, vegetation, and air quality.'
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Live environmental data updates with instant alerts for temperature spikes, air quality changes, and other critical events.'
    }
  ];

  const technologies = [
    { name: 'React + TypeScript', category: 'Frontend' },
    { name: 'Three.js + WebGL', category: 'Visualization' },
    { name: 'Node.js + Express', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'NASA MODIS', category: 'Satellite Data' },
    { name: 'OpenAI GPT', category: 'AI Integration' },
    { name: 'Recharts', category: 'Data Visualization' },
    { name: 'Framer Motion', category: 'Animations' }
  ];

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
          About Ecoverse
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed max-w-4xl">
          Ecoverse is a cutting-edge environmental monitoring platform that leverages space data, 
          artificial intelligence, and community collaboration to reimagine healthy cities. 
          Our mission is to provide actionable insights for sustainable urban development across Maharashtra's 34 cities.
        </p>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="p-3 rounded-lg bg-white/10 w-fit mb-4">
                <feature.icon className="w-8 h-8 text-eco-blue" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Technology Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Technology Stack</h2>
        <div className="glass rounded-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white/10 rounded-lg p-4 mb-3">
                  <div className="text-white font-medium text-sm">{tech.name}</div>
                </div>
                <div className="text-gray-400 text-xs">{tech.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Data Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Data Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'NASA MODIS',
              description: 'Land Surface Temperature (LST) and Normalized Difference Vegetation Index (NDVI) data',
              metrics: ['Temperature mapping', 'Vegetation analysis', 'Heat island detection']
            },
            {
              title: 'Ground Sensors',
              description: 'Real-time air quality, weather stations, and environmental monitoring equipment',
              metrics: ['Air Quality Index', 'Weather patterns', 'Pollution levels']
            },
            {
              title: 'Community Data',
              description: 'Citizen-reported environmental observations and local environmental initiatives',
              metrics: ['Local reporting', 'Event tracking', 'Community engagement']
            }
          ].map((source, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3 className="text-white font-semibold text-lg mb-3">{source.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{source.description}</p>
              <div className="space-y-2">
                {source.metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-eco-green rounded-full"></div>
                    <span className="text-gray-400 text-sm">{metric}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Impact & Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Our Impact & Goals</h2>
        <div className="glass rounded-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Current Impact</h3>
              <div className="space-y-4">
                {[
                  { metric: 'Cities Monitored', value: '34', unit: 'Maharashtra cities' },
                  { metric: 'Data Points', value: '10M+', unit: 'Environmental measurements' },
                  { metric: 'Heat Islands Identified', value: '247', unit: 'Critical zones' },
                  { metric: 'AI Predictions', value: '95%', unit: 'Accuracy rate' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{stat.metric}</span>
                    <div className="text-right">
                      <span className="text-white font-bold text-lg">{stat.value}</span>
                      <div className="text-gray-400 text-sm">{stat.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Future Goals</h3>
              <div className="space-y-3">
                {[
                  'Expand coverage to all Indian metropolitan cities',
                  'Integrate real-time IoT sensor networks',
                  'Develop predictive climate models with 99% accuracy',
                  'Enable citizen science data collection platform',
                  'Create automated policy recommendation system'
                ].map((goal, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-eco-blue rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-center"
      >
        <div className="glass rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Join the Movement</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Together, we can build smarter, healthier, and more sustainable cities. 
            Join thousands of urban planners, researchers, and citizens working towards a better future.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-eco-blue to-eco-green px-8 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all duration-300">
              Get Started
            </button>
            <button className="border border-white/30 px-8 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;