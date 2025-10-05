import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, LayoutDashboard, BarChart3, Info, Filter, TrendingUp, 
  MapPin, Thermometer, Wind, Droplets, Leaf 
} from 'lucide-react';
import MainDashboard from './components/MainDashboard';
import FilterPanel from './components/FilterPanel';
import InsightsPage from './components/InsightsPage';
import AboutPage from './components/AboutPage';
import AuthFlow from './components/auth/AuthFlow';
import './index.css';

// 3D Earth Component
const Earth3D = () => {
  return (
    <group>
      {/* Main Earth Sphere */}
      <Sphere args={[2.5, 64, 32]}>
        <meshStandardMaterial
          color="#4A90E2"
          roughness={0.8}
          metalness={0.1}
          transparent={true}
          opacity={0.9}
        />
      </Sphere>
      
      {/* Land masses - simplified green patches */}
      <Sphere args={[2.51, 32, 16]}>
        <meshBasicMaterial
          color="#10B981"
          transparent={true}
          opacity={0.6}
          wireframe={true}
        />
      </Sphere>
      
      {/* Atmosphere glow effect */}
      <Sphere args={[2.8, 32, 16]}>
        <meshBasicMaterial
          color="#60A5FA"
          transparent={true}
          opacity={0.1}
          side={1} // BackSide
        />
      </Sphere>
    </group>
  );
};

// Green orbital rings around Earth
const OrbitalRings = () => {
  return (
    <>
      {[3.5, 4.2, 5.0].map((radius, index) => (
        <group key={index} rotation={[0, 0, index * 0.3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 8, 100]} />
            <meshBasicMaterial color="#10B981" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </>
  );
};

// Floating particles effect
const Particles = () => {
  const particleCount = 100;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    
    particles.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.02]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
      </mesh>
    );
  }
  
  return <>{particles}</>;
};

// Header Navigation
const Header = ({ currentPage, setCurrentPage, isAuthenticated, user, userRole, onLogout }: { 
  currentPage: string, 
  setCurrentPage: (page: string) => void,
  isAuthenticated: boolean,
  user: any,
  userRole: string | null,
  onLogout: () => void
}) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-eco-blue to-eco-green rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Ecoverse</h1>
            <p className="text-gray-300 text-sm">Environmental Monitoring</p>
          </div>
        </div>

        <nav className="flex items-center space-x-6">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'insights', label: 'Insights', icon: BarChart3 },
            { id: 'about', label: 'About', icon: Info },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === id
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.fullName}</p>
              <p className="text-xs text-gray-300 capitalize">{userRole?.replace('-', ' ')}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setCurrentPage('auth')}
            className="bg-gradient-to-r from-eco-blue to-eco-green px-6 py-2 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-eco-blue/25 transition-all duration-300"
          >
            Sign In
          </button>
        )}
      </div>
    </motion.header>
  );
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showFilters, setShowFilters] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('ecoverse-auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
      setUserRole(authData.role);
    }
  }, []);

  const handleAuthComplete = (userData: any, role: string) => {
    const authData = { user: userData, role };
    localStorage.setItem('ecoverse-auth', JSON.stringify(authData));
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('ecoverse-auth');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Background Canvas with 3D Earth */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Earth3D />
            <OrbitalRings />
            <Particles />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Header */}
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isAuthenticated={isAuthenticated}
        user={user}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="relative z-10 pt-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center max-w-4xl mx-auto px-6">
                <motion.h1
                  className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  Ecoverse
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-300 mb-8 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  Reimagining Healthy Cities with Space Data
                  <br />
                  Leveraging satellites to precisely assess the factors in cities for healthy smart environments, 
                  track environment health, and unlock sustainable cities of the future.
                </motion.p>
                <motion.div
                  className="flex justify-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-gradient-to-r from-eco-blue to-eco-green px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-eco-blue/25 transition-all duration-300"
                  >
                    Explore Dashboard
                  </button>
                  <button 
                    onClick={() => setCurrentPage('about')}
                    className="border border-white/30 px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-all duration-300"
                  >
                    Learn More
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentPage === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MainDashboard />
            </motion.div>
          )}

          {currentPage === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InsightsPage />
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AboutPage />
            </motion.div>
          )}

          {currentPage === 'auth' && !isAuthenticated && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AuthFlow onAuthComplete={handleAuthComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <FilterPanel 
            onClose={() => setShowFilters(false)} 
            onApplyFilters={() => {}} 
            currentFilters={{
              region: 'all',
              tempMin: 20,
              tempMax: 45,
              aqiMin: 0,
              aqiMax: 300,
              ndviMin: 0.1,
              ndviMax: 0.8,
              risk: 'all'
            }} 
          />
        )}
      </AnimatePresence>

      {/* Floating Filter Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-eco-blue to-eco-green p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        onClick={() => setShowFilters(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Filter className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
}

export default App;
