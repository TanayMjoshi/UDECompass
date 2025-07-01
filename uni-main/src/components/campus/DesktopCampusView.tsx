import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Settings,
  Bell,
  Cloud,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Building } from '../../types/Building';
import { useLanguage } from '../../contexts/LanguageContext';
import WeatherWidget from '../WeatherWidget';
import EventsCalendar from '../EventsCalendar';
import LiveUpdates from '../LiveUpdates';
import SettingsModal from '../SettingsModal';

interface DesktopCampusViewProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  isDarkMode: boolean;
  onBuildingClick: (building: Building) => void;
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
}

const DesktopCampusView: React.FC<DesktopCampusViewProps> = ({
  buildings,
  selectedBuilding,
  isDarkMode,
  onBuildingClick,
  onToggleSidebar,
  onToggleDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useLanguage();

  // Filter buildings based on search and category
  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         building.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         building.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || building.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All', icon: '🏛️', color: 'bg-gray-500' },
    { id: 'academic', label: 'Academic', icon: '📚', color: 'bg-blue-500' },
    { id: 'dining', label: 'Dining', icon: '🍽️', color: 'bg-red-500' },
    { id: 'student', label: 'Student Life', icon: '👥', color: 'bg-pink-500' },
    { id: 'administrative', label: 'Admin', icon: '🏢', color: 'bg-green-500' },
    { id: 'digital', label: 'Digital', icon: '💻', color: 'bg-purple-500' }
  ];

  const handleWidgetToggle = (widgetName: string) => {
    if (activeWidget === widgetName) {
      setActiveWidget(null);
    } else {
      setActiveWidget(widgetName);
      if (showNotifications) {
        setShowNotifications(false);
      }
    }
  };

  const handleNotificationsToggle = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && activeWidget) {
      setActiveWidget(null);
    }
  };

  // Create grid pattern for building cards
  const createGridPattern = (color: string) => {
    return (
      <div className="absolute inset-4">
        <div className="grid grid-cols-4 gap-1 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-sm opacity-30"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
      {/* Controls Section */}
      <div className={`flex-shrink-0 px-8 py-6 ${
        isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-xl border-b ${
        isDarkMode ? 'border-gray-800' : 'border-gray-100'
      } shadow-sm relative`}>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between mb-6">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            {/* Weather Widget Button */}
            <motion.button
              onClick={() => handleWidgetToggle('weather')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                activeWidget === 'weather' 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Weather"
            >
              <Cloud className="w-5 h-5" />
            </motion.button>

            {/* Events Calendar Button */}
            <motion.button
              onClick={() => handleWidgetToggle('events')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                activeWidget === 'events' 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Events"
            >
              <Calendar className="w-5 h-5" />
            </motion.button>

            {/* Notifications Button */}
            <motion.button
              onClick={handleNotificationsToggle}
              className={`p-3 rounded-xl transition-all duration-200 relative ${
                showNotifications 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className={`relative rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              } transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/20`}>
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search buildings or services..."
                  className={`w-full pl-10 pr-10 py-3 rounded-xl ${
                    isDarkMode 
                      ? 'bg-transparent text-white placeholder-gray-500' 
                      : 'bg-transparent text-gray-900 placeholder-gray-500'
                  } focus:outline-none text-sm`}
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${
                    showFilters 
                      ? 'bg-blue-500 text-white' 
                      : isDarkMode ? 'text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-200'
                  } transition-all duration-200`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setShowSettings(true)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Widget Display Area */}
        <AnimatePresence>
          {(activeWidget || showNotifications) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex justify-center">
                {activeWidget === 'weather' && <WeatherWidget isDarkMode={isDarkMode} />}
                {activeWidget === 'events' && <EventsCalendar isDarkMode={isDarkMode} />}
                {showNotifications && (
                  <div className="w-full max-w-md">
                    <LiveUpdates isDarkMode={isDarkMode} isExpanded={true} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex justify-center gap-3">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm">{category.icon}</span>
                    <span className="font-medium text-sm">{category.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Counter */}
        <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {filteredBuildings.length} {filteredBuildings.length === 1 ? 'building' : 'buildings'} found
        </div>
      </div>

      {/* Title Section - Moved to main content area */}
      <div className="flex-shrink-0 text-center py-8 px-8">
        <motion.h1 
          className={`text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          University of Duisburg-Essen
        </motion.h1>
        <motion.p 
          className={`text-xl ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Welcome to Your Campus Guide
        </motion.p>
      </div>

      {/* Buildings Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {filteredBuildings.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-6">🔍</div>
                <p className={`text-xl font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No buildings found
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try adjusting your search or filters
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBuildings.map((building, index) => (
                <motion.div
                  key={building.id}
                  className="flex flex-col items-center space-y-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Building Card */}
                  <motion.div
                    className="relative w-64 h-48 rounded-3xl shadow-xl cursor-pointer overflow-hidden"
                    style={{ backgroundColor: building.color }}
                    onClick={() => onBuildingClick(building)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: selectedBuilding?.id === building.id 
                        ? [
                            `0 20px 60px ${building.color}40`,
                            `0 25px 80px ${building.color}60`,
                            `0 20px 60px ${building.color}40`
                          ]
                        : `0 20px 60px ${building.color}30`
                    }}
                    transition={{
                      boxShadow: { duration: 2, repeat: selectedBuilding?.id === building.id ? Infinity : 0 }
                    }}
                  >
                    {/* Grid Pattern */}
                    {createGridPattern(building.color)}
                    
                    {/* Icon */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <div className="text-white text-xl">
                        {building.icon}
                      </div>
                    </div>

                    {/* Star for main buildings */}
                    {building.isMainBuilding && (
                      <div className="absolute top-4 right-4">
                        <Star className="w-6 h-6 text-yellow-300 fill-current" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="text-white text-center p-4">
                        <ArrowRight className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Click to explore</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Building Label */}
                  <motion.div
                    className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t(`building.${building.id}`) || building.name}
                  </motion.div>

                  {/* Building Info Card */}
                  <div className={`w-full max-w-xs p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
                  } backdrop-blur-sm border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } shadow-lg`}>
                    {/* Category */}
                    <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t(`building.${building.id}.category`) || building.category}
                    </p>
                    
                    {/* Description */}
                    <p className={`text-xs leading-relaxed mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {building.description}
                    </p>

                    {/* Services */}
                    <div className="mb-3">
                      <h4 className={`text-xs font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Available Services
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {building.services.slice(0, 3).map((service, serviceIndex) => (
                          <div
                            key={serviceIndex}
                            className={`px-2 py-1 rounded text-xs font-medium text-center ${
                              isDarkMode 
                                ? 'bg-gray-700/50 text-gray-300' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                            style={{ fontSize: '10px' }}
                          >
                            {service}
                          </div>
                        ))}
                      </div>
                      {building.services.length > 3 && (
                        <p className={`text-xs mt-1 text-center ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          +{building.services.length - 3} more services
                        </p>
                      )}
                    </div>
                    
                    {/* Quick Info */}
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-1">
                        <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Open Now</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
    </div>
  );
};

export default DesktopCampusView;