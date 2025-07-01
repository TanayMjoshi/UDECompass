import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Settings, MapPin, Menu, LogOut, Languages, Sparkles, Cloud, Calendar, Grid as Grid3X3, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import LiveUpdates from './LiveUpdates';
import SettingsModal from './SettingsModal';
import UserProfileModal from './UserProfileModal';
import WeatherWidget from './WeatherWidget';
import EventsCalendar from './EventsCalendar';
import { Building } from '../types/Building';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  onBuildingSelect?: (building: Building) => void;
  viewMode?: 'cards' | 'map';
  onViewModeChange?: (mode: 'cards' | 'map') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  onToggleDarkMode, 
  onToggleSidebar,
  onBuildingSelect,
  viewMode = 'cards',
  onViewModeChange
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  const handleDropdownToggle = (dropdownName: string) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.div 
        className={`w-full ${
          isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
        } backdrop-blur-xl border-b ${
          isDarkMode ? 'border-gray-800' : 'border-gray-100'
        } shadow-sm relative z-50`}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onToggleSidebar}
                className={`p-3 rounded-2xl transition-all duration-200 ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
              
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <MapPin className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </motion.div>
                <h1 className={`text-xl font-bold bg-gradient-to-r ${
                  isDarkMode 
                    ? 'from-blue-400 to-purple-400' 
                    : 'from-blue-600 to-purple-600'
                } bg-clip-text text-transparent`}>
                  {t('header.title')}
                </h1>
              </motion.div>
            </div>

            {/* Center Search Bar - Hide on mobile */}
            {/* {!isMobile && (
              <div className="flex-1 max-w-2xl mx-8">
                <SearchBar 
                  isDarkMode={isDarkMode} 
                  onBuildingSelect={onBuildingSelect || (() => {})}
                />
              </div>
            )} */}
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle - Desktop only */}
              {!isMobile && onViewModeChange && (
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <motion.button
                    onClick={() => onViewModeChange('cards')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'cards'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Card View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => onViewModeChange('map')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'map'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Map View"
                  >
                    <Map className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {/* Weather Widget Button - Hide on mobile */}
              {!isMobile && (
                <motion.button
                  onClick={() => handleDropdownToggle('weather')}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    activeDropdown === 'weather' 
                      ? 'bg-blue-500 text-white' 
                      : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Weather"
                >
                  <Cloud className="w-5 h-5" />
                </motion.button>
              )}

              {/* Events Calendar Button - Hide on mobile */}
              {!isMobile && (
                <motion.button
                  onClick={() => handleDropdownToggle('events')}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    activeDropdown === 'events' 
                      ? 'bg-blue-500 text-white' 
                      : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Events"
                >
                  <Calendar className="w-5 h-5" />
                </motion.button>
              )}

              {/* Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                className={`p-3 rounded-2xl transition-all duration-200 flex items-center space-x-2 ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
                title={language === 'en' ? 'Switch to German' : 'Auf Englisch wechseln'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Languages className="w-4 h-4" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={onToggleDarkMode}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 shadow-lg' 
                    : 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: isDarkMode 
                    ? ['0 0 10px rgba(234, 179, 8, 0.3)', '0 0 20px rgba(234, 179, 8, 0.5)', '0 0 10px rgba(234, 179, 8, 0.3)']
                    : ['0 0 10px rgba(31, 41, 55, 0.3)', '0 0 20px rgba(31, 41, 55, 0.5)', '0 0 10px rgba(31, 41, 55, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              
              <LiveUpdates isDarkMode={isDarkMode} />
              
              {!isMobile && (
                <motion.button 
                  onClick={() => setShowSettings(true)}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title={t('settings.title')}
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              )}
              
              {/* User Profile Section - Simplified on mobile */}
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(59, 130, 246, 0.3)',
                        '0 0 20px rgba(147, 51, 234, 0.5)',
                        '0 0 10px rgba(59, 130, 246, 0.3)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>
                  {!isMobile && (
                    <div className="hidden sm:block">
                      <span className={`text-sm font-medium flex items-center space-x-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        <span>{t('header.welcome')}, {user?.name || 'Student'}</span>
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                      </span>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user?.email}
                      </p>
                    </div>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={handleLogout}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title={t('header.logout')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weather Widget Dropdown */}
      {activeDropdown === 'weather' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-6 z-[90]"
        >
          <WeatherWidget isDarkMode={isDarkMode} />
        </motion.div>
      )}

      {/* Events Calendar Dropdown */}
      {activeDropdown === 'events' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-6 z-[90] max-w-md"
        >
          <EventsCalendar isDarkMode={isDarkMode} />
        </motion.div>
      )}

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        isDarkMode={isDarkMode}
      />

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-[80]"
          onClick={closeAllDropdowns}
        />
      )}
    </>
  );
};

export default Header;