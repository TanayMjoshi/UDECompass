import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Users, 
  Settings,
  Bell,
  Cloud,
  Calendar,
  Star,
  ArrowRight
} from 'lucide-react';
import { Building } from '../../types/Building';
import { useLanguage } from '../../contexts/LanguageContext';
import WeatherWidget from '../WeatherWidget';
import EventsCalendar from '../EventsCalendar';
import LiveUpdates from '../LiveUpdates';
import SettingsModal from '../SettingsModal';

interface MobileCampusViewProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  isDarkMode: boolean;
  onBuildingClick: (building: Building) => void;
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
}

const MobileCampusView: React.FC<MobileCampusViewProps> = ({
  buildings,
  selectedBuilding,
  isDarkMode,
  onBuildingClick,
  onToggleSidebar,
  onToggleDarkMode
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Smooth scroll to building
  const scrollToBuilding = (index: number) => {
    if (containerRef.current) {
      const targetElement = containerRef.current.children[index] as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        setCurrentIndex(index);
      }
    }
  };

  // Handle scroll events for snap detection
  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      Array.from(container.children).forEach((child, index) => {
        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.top + childRect.height / 2;
        const distance = Math.abs(childCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== currentIndex) {
        setCurrentIndex(closestIndex);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex, filteredBuildings.length]);

  const handleWidgetToggle = (widgetName: string) => {
    if (activeWidget === widgetName) {
      setActiveWidget(null);
    } else {
      setActiveWidget(widgetName);
      // Close notifications if opening another widget
      if (showNotifications) {
        setShowNotifications(false);
      }
    }
  };

  const handleNotificationsToggle = () => {
    setShowNotifications(!showNotifications);
    // Close other widgets if opening notifications
    if (!showNotifications && activeWidget) {
      setActiveWidget(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
      {/* Fixed Header with Mobile Controls */}
      <div className={`flex-shrink-0 px-4 py-3 ${
        isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-xl border-b ${
        isDarkMode ? 'border-gray-800' : 'border-gray-100'
      } shadow-sm relative z-50`}>
        
        {/* Top Row - Controls */}
        <div className="flex items-center justify-between mb-4">
          {/* Welcome Section */}
          <div>
            <motion.h1 
              className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Welcome to UDE
            </motion.h1>
            <motion.p 
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Explore your campus with ease
            </motion.p>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2">
            {/* Weather Widget Button */}
            <motion.button
              onClick={() => handleWidgetToggle('weather')}
              className={`p-2 rounded-xl transition-all duration-200 ${
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
              className={`p-2 rounded-xl transition-all duration-200 ${
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
              className={`p-2 rounded-xl transition-all duration-200 relative ${
                showNotifications 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Settings Button */}
            <motion.button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Widget Display Area - Pushes content down */}
        <AnimatePresence>
          {(activeWidget || showNotifications) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden"
            >
              {activeWidget === 'weather' && (
                <div className="flex justify-center">
                  <WeatherWidget isDarkMode={isDarkMode} />
                </div>
              )}
              {activeWidget === 'events' && (
                <div className="flex justify-center">
                  <EventsCalendar isDarkMode={isDarkMode} />
                </div>
              )}
              {showNotifications && (
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <LiveUpdates isDarkMode={isDarkMode} isExpanded={true} />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <div className="relative mb-3">
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

        {/* Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
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
                    <span className="font-medium text-xs whitespace-nowrap">{category.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Counter */}
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {filteredBuildings.length} {filteredBuildings.length === 1 ? 'building' : 'buildings'} found
        </div>
      </div>

      {/* Buildings Container - Instagram-style hidden scrollbar */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory px-4 py-2 scrollbar-hide"
        style={{ 
          scrollSnapType: 'y mandatory',
          maxWidth: '100vw',
          overflowX: 'hidden',
          // Instagram-style scrolling
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {filteredBuildings.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No buildings found
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          filteredBuildings.map((building, index) => (
            <motion.div
              key={building.id}
              className="snap-center mb-4 last:mb-8 w-full"
              style={{ maxWidth: '100%' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Building Card - Constrained width */}
              <motion.div
                className={`relative w-full max-w-full ${
                  isDarkMode ? 'bg-gray-800/80' : 'bg-white/90'
                } backdrop-blur-xl rounded-2xl p-6 shadow-lg border ${
                  isDarkMode ? 'border-gray-700/50' : 'border-white/50'
                } overflow-hidden`}
                onClick={() => onBuildingClick(building)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: selectedBuilding?.id === building.id 
                    ? [
                        `0 10px 40px ${building.color}30`,
                        `0 15px 60px ${building.color}40`,
                        `0 10px 40px ${building.color}30`
                      ]
                    : isDarkMode 
                      ? '0 10px 40px rgba(0,0,0,0.3)' 
                      : '0 10px 40px rgba(0,0,0,0.1)',
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: selectedBuilding?.id === building.id ? Infinity : 0 }
                }}
              >
                {/* Background Gradient */}
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `radial-gradient(circle at top right, ${building.color}, transparent 70%)`
                  }}
                />

                {/* Content */}
                <div className="relative z-10 w-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 w-full">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: building.color }}
                      >
                        <div className="text-white text-xl">
                          {building.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        } truncate`}>
                          {t(`building.${building.id}`) || building.name}
                        </h3>
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        } truncate`}>
                          {t(`building.${building.id}.category`) || building.category}
                        </p>
                      </div>
                    </div>
                    {building.isMainBuilding && (
                      <div className="flex-shrink-0">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed mb-4 w-full ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {building.description}
                  </p>

                  {/* Services Grid - Responsive */}
                  <div className="mb-4 w-full">
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Available Services
                    </h4>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {building.services.slice(0, 4).map((service, serviceIndex) => (
                        <div
                          key={serviceIndex}
                          className={`px-3 py-2 rounded-lg text-xs font-medium text-center break-words ${
                            isDarkMode 
                              ? 'bg-gray-700/50 text-gray-300' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                          style={{ wordBreak: 'break-word', hyphens: 'auto' }}
                        >
                          {service}
                        </div>
                      ))}
                    </div>
                    {building.services.length > 4 && (
                      <p className={`text-xs mt-2 text-center w-full ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        +{building.services.length - 4} more services
                      </p>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="flex justify-between items-center mb-4 w-full">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Campus
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Open Now
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className={`flex items-center justify-center py-3 px-4 rounded-xl w-full ${
                    isDarkMode 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  } transition-all duration-200`}>
                    <span className="text-sm font-medium mr-2">Tap to explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className={`flex-shrink-0 px-4 py-3 ${
        isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-xl border-t ${
        isDarkMode ? 'border-gray-800' : 'border-gray-100'
      }`}>
        {/* Navigation Dots */}
        <div className="flex justify-center space-x-1 mb-2">
          {filteredBuildings.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToBuilding(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-500 w-4'
                  : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
          ))}
          {filteredBuildings.length > 5 && (
            <div className={`w-2 h-2 rounded-full ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
        
        {/* Current Building Info */}
        {filteredBuildings[currentIndex] && (
          <div className="text-center">
            <h4 className={`text-sm font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {filteredBuildings[currentIndex].name}
            </h4>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {currentIndex + 1} of {filteredBuildings.length}
            </p>
          </div>
        )}
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

export default MobileCampusView;