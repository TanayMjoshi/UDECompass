import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import CampusMap from './CampusMap';
import BuildingPage from './BuildingPage';
import AdvancedCampusView from './campus/AdvancedCampusView';
import { Building } from '../types/Building';
import { buildingPagesData } from '../data/buildingPages';
import { buildings } from '../data/buildings';

const CampusNavigator: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('ude-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ude-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
    setShowSidebar(false);
  };

  const handleBackToMap = () => {
    setSelectedBuilding(null);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // If showing building details
  if (selectedBuilding) {
    const pageData = buildingPagesData[selectedBuilding.id];
    if (pageData) {
      return (
        <BuildingPage
          building={selectedBuilding}
          pageData={pageData}
          isDarkMode={isDarkMode}
          onBack={handleBackToMap}
        />
      );
    }
  }

  // Main campus view with advanced features
  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`}>
      {/* Header - Only show on desktop or when not using advanced view */}
      {!isMobile && (
        <Header 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={toggleDarkMode}
          onToggleSidebar={toggleSidebar}
          onBuildingSelect={handleBuildingClick}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Only show on desktop */}
        {!isMobile && (
          <Sidebar 
            isOpen={showSidebar}
            isDarkMode={isDarkMode}
            onBuildingClick={handleBuildingClick}
            onClose={() => setShowSidebar(false)}
          />
        )}
        
        <motion.main 
          className="flex-1 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {viewMode === 'cards' || isMobile ? (
            <AdvancedCampusView
              buildings={buildings}
              selectedBuilding={selectedBuilding}
              isDarkMode={isDarkMode}
              onBuildingClick={handleBuildingClick}
              onToggleSidebar={toggleSidebar}
              onToggleDarkMode={toggleDarkMode}
            />
          ) : (
            <CampusMap 
              isDarkMode={isDarkMode}
              onBuildingClick={handleBuildingClick}
              selectedBuilding={selectedBuilding}
            />
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default CampusNavigator;