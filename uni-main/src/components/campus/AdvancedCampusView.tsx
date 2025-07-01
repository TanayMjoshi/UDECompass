import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building } from '../../types/Building';
import { useLanguage } from '../../contexts/LanguageContext';
import DesktopCampusView from './DesktopCampusView';
import MobileCampusView from './MobileCampusView';
import EnhancedAIAssistant from '../chat/EnhancedAIAssistant';

interface AdvancedCampusViewProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  isDarkMode: boolean;
  onBuildingClick: (building: Building) => void;
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
}

const AdvancedCampusView: React.FC<AdvancedCampusViewProps> = ({
  buildings,
  selectedBuilding,
  isDarkMode,
  onBuildingClick,
  onToggleSidebar,
  onToggleDarkMode
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLanguage();

  // Responsive detection with smooth transitions
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsMobile(newIsMobile);
          setIsTransitioning(false);
        }, 150);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  const handleBuildingSelect = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (building) {
      onBuildingClick(building);
    }
  };

  // Show loading during transition
  if (isTransitioning) {
    return (
      <div className={`h-full flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* Responsive Campus View */}
      <AnimatePresence mode="wait">
        {isMobile ? (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <MobileCampusView
              buildings={buildings}
              selectedBuilding={selectedBuilding}
              isDarkMode={isDarkMode}
              onBuildingClick={onBuildingClick}
              onToggleSidebar={onToggleSidebar}
              onToggleDarkMode={onToggleDarkMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <DesktopCampusView
              buildings={buildings}
              selectedBuilding={selectedBuilding}
              isDarkMode={isDarkMode}
              onBuildingClick={onBuildingClick}
              onToggleSidebar={onToggleSidebar}
              onToggleDarkMode={onToggleDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced AI Chat Assistant - Always Available */}
      <EnhancedAIAssistant
        isDarkMode={isDarkMode}
        isMobile={isMobile}
        onBuildingSelect={handleBuildingSelect}
      />

      {/* Accessibility Features */}
      <div className="sr-only">
        <h1>{t('header.title')}</h1>
        <p>
          {isMobile 
            ? 'Mobile campus navigation interface with touch-friendly controls and AI assistant'
            : 'Desktop campus navigation interface with advanced features and AI assistant'
          }
        </p>
        <p>
          Enhanced AI chat assistant available for real-time help, voice commands, and natural language processing. 
          {buildings.length} buildings available for exploration.
        </p>
      </div>
    </div>
  );
};

export default AdvancedCampusView;