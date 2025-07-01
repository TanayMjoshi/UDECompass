import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Building } from '../types/Building';
import { buildings } from '../data/buildings';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
  isDarkMode: boolean;
  onBuildingSelect: (building: Building) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isDarkMode, onBuildingSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(query.toLowerCase()) ||
    building.category.toLowerCase().includes(query.toLowerCase()) ||
    building.services.some(service => service.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(e.target.value.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredBuildings.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredBuildings[selectedIndex]) {
          handleBuildingSelect(filteredBuildings[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleBuildingSelect = (building: Building) => {
    onBuildingSelect(building);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl" ref={resultsRef}>
      {/* Search Input */}
      <div className={`relative rounded-2xl transition-all duration-300 ${
        isOpen 
          ? 'ring-2 ring-blue-500/20' 
          : ''
      } ${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      } backdrop-blur-xl border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } shadow-lg`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className={`block w-full pl-12 pr-12 py-4 rounded-2xl ${
            isDarkMode 
              ? 'bg-transparent text-white placeholder-gray-500' 
              : 'bg-transparent text-gray-900 placeholder-gray-500'
          } focus:outline-none text-base`}
          placeholder={t('search.placeholder')}
        />
        {query && (
          <button
            onClick={clearSearch}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
              isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && filteredBuildings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border z-50 ${
              isDarkMode 
                ? 'bg-gray-800/95 border-gray-700' 
                : 'bg-white/95 border-gray-200'
            } backdrop-blur-xl overflow-hidden`}
          >
            <div className="max-h-80 overflow-y-auto">
              {filteredBuildings.map((building, index) => (
                <motion.button
                  key={building.id}
                  onClick={() => handleBuildingSelect(building)}
                  className={`w-full p-4 text-left transition-all duration-200 ${
                    index === selectedIndex
                      ? isDarkMode
                        ? 'bg-blue-600/20 border-l-4 border-blue-500'
                        : 'bg-blue-50 border-l-4 border-blue-500'
                      : isDarkMode
                        ? 'hover:bg-gray-700/50'
                        : 'hover:bg-gray-50'
                  } ${index !== filteredBuildings.length - 1 ? 
                    isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200' 
                    : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: building.color }}
                    >
                      {building.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-base ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {building.name}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {building.category}
                      </p>
                      <p className={`text-xs mt-1 line-clamp-2 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {building.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {isOpen && query.length > 0 && filteredBuildings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl shadow-2xl border ${
              isDarkMode 
                ? 'bg-gray-800/95 border-gray-700' 
                : 'bg-white/95 border-gray-200'
            } backdrop-blur-xl text-center`}
          >
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t('search.noResults')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;