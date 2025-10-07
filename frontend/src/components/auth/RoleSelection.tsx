import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Building, Users, User, Crown } from 'lucide-react';

interface RoleSelectionProps {
  userData: any;
  onRoleSelected: (role: string) => void;
}

const roles = [
  {
    id: 'urban-planner',
    title: 'Urban Planner',
    description: 'Expert analytics, heatmap, full heat, zone planning tools.',
    icon: Building,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'local-leader',
    title: 'Local Leader',
    description: 'Create alerts by priority, zoning of land, committee decisions.',
    icon: Crown,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'citizen',
    title: 'Citizen',
    description: 'Report Civic helpdesk and track community tools.',
    icon: User,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  {
    id: 'local-leader-2',
    title: 'Local Leader',
    description: 'Create alerts by municipal and planning tools.',
    icon: Users,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30'
  }
];

const RoleSelection: React.FC<RoleSelectionProps> = ({ userData, onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onRoleSelected(selectedRole);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-500/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 25 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-2xl border border-slate-700/50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">EcoVerse</h1>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Choose your role</h2>
          <p className="text-slate-400">Tailor experience to plan, analyze, or engage your community.</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <motion.div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2
                  ${isSelected 
                    ? `${role.bgColor} ${role.borderColor} border-opacity-100` 
                    : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50'
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  ${isSelected 
                    ? `bg-gradient-to-br ${role.color}` 
                    : 'bg-slate-600/50'
                  }
                `}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{role.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{role.description}</p>
                </div>

                {/* Continue Button */}
                {isSelected && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinue();
                    }}
                    disabled={isLoading}
                    className={`
                      w-full mt-4 py-2 px-4 rounded-lg font-medium transition-all duration-300
                      bg-gradient-to-r ${role.color} hover:shadow-lg hover:shadow-${role.color.split('-')[1]}-500/25
                      text-white disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Setting up...
                      </div>
                    ) : (
                      'Continue'
                    )}
                  </motion.button>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Built for communities and cities — fast, simple and privacy first
          </p>
        </div>

        {/* Welcome message */}
        {userData?.fullName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-300 text-sm">
              Welcome, <span className="text-green-400 font-medium">{userData.fullName}</span>!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RoleSelection;