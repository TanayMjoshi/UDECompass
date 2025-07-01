import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { Building } from '../types/Building';
import { buildings } from '../data/buildings';

interface CampusMapProps {
  isDarkMode: boolean;
  onBuildingClick: (building: Building) => void;
  selectedBuilding: Building | null;
}

const CampusMap: React.FC<CampusMapProps> = ({ 
  isDarkMode, 
  onBuildingClick, 
  selectedBuilding 
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === mapRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <motion.button
          onClick={handleZoomIn}
          className={`p-3 rounded-xl shadow-lg backdrop-blur-md transition-all ${
            isDarkMode 
              ? 'bg-gray-800/90 hover:bg-gray-700 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomIn className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          onClick={handleZoomOut}
          className={`p-3 rounded-xl shadow-lg backdrop-blur-md transition-all ${
            isDarkMode 
              ? 'bg-gray-800/90 hover:bg-gray-700 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomOut className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          onClick={handleReset}
          className={`p-3 rounded-xl shadow-lg backdrop-blur-md transition-all ${
            isDarkMode 
              ? 'bg-gray-800/90 hover:bg-gray-700 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className={`px-3 py-2 rounded-lg shadow-lg backdrop-blur-md text-sm font-medium ${
          isDarkMode 
            ? 'bg-gray-800/90 text-white' 
            : 'bg-white/90 text-gray-800'
        }`}>
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Campus Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Campus Background */}
        <div className={`relative w-full h-full ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-green-100 to-blue-100'
        }`}>
          
          {/* Campus Paths */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path 
                  d="M 50 0 L 0 0 0 50" 
                  fill="none" 
                  stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Main Campus Paths */}
            <path
              d="M 100 300 Q 400 250 700 300 T 1100 350"
              stroke={isDarkMode ? '#4B5563' : '#9CA3AF'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 200 150 Q 500 200 800 150"
              stroke={isDarkMode ? '#4B5563' : '#9CA3AF'}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Buildings */}
          <div className="relative" style={{ zIndex: 2 }}>
            {buildings.map((building) => (
              <motion.div
                key={building.id}
                className="absolute cursor-pointer"
                style={{
                  left: building.x,
                  top: building.y,
                  width: building.width,
                  height: building.height,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: selectedBuilding?.id === building.id ? 1.1 : 1,
                }}
                transition={{ 
                  duration: 0.3,
                  delay: buildings.indexOf(building) * 0.1 
                }}
                whileHover={{ 
                  scale: selectedBuilding?.id === building.id ? 1.15 : 1.05,
                  zIndex: 10 
                }}
                onClick={() => onBuildingClick(building)}
                onMouseEnter={() => setHoveredBuilding(building.id)}
                onMouseLeave={() => setHoveredBuilding(null)}
              >
                {/* Building Structure */}
                <div
                  className={`w-full h-full rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                    selectedBuilding?.id === building.id
                      ? 'border-white shadow-2xl'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{
                    backgroundColor: building.color,
                    boxShadow: selectedBuilding?.id === building.id 
                      ? `0 20px 60px ${building.color}40, 0 0 0 4px ${building.color}20`
                      : `0 10px 30px ${building.color}30`
                  }}
                >
                  {/* Building Content */}
                  <div className="p-4 h-full flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">
                        {building.icon}
                      </div>
                      {building.isMainBuilding && (
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-sm mb-1 leading-tight">
                        {building.name}
                      </h3>
                      <p className="text-xs opacity-90 leading-tight">
                        {building.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Tooltip */}
                <AnimatePresence>
                  {hoveredBuilding === building.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className={`absolute -top-16 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-md text-sm font-medium whitespace-nowrap z-20 ${
                        isDarkMode 
                          ? 'bg-gray-800/95 text-white border border-gray-600' 
                          : 'bg-white/95 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {building.description}
                      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                        isDarkMode ? 'border-t-gray-800' : 'border-t-white'
                      }`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Campus Features */}
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            {/* Trees and Landscaping */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-8 h-8 rounded-full ${
                  isDarkMode ? 'bg-green-800' : 'bg-green-400'
                }`}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 80 + 10}%`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            ))}
            
            {/* Parking Areas */}
            <div className={`absolute bottom-20 left-20 w-32 h-20 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            } opacity-50`} />
            <div className={`absolute top-20 right-32 w-28 h-16 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            } opacity-50`} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className={`p-4 rounded-xl shadow-lg backdrop-blur-md ${
          isDarkMode 
            ? 'bg-gray-800/90 text-white' 
            : 'bg-white/90 text-gray-800'
        }`}>
          <h4 className="font-semibold mb-2 text-sm">Campus Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Academic Buildings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Dining & Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Administration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Main Buildings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;