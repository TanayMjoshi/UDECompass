import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter, Star, Clock, Users, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Building } from '../types/Building';
import { buildings } from '../data/buildings';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onBuildingClick: (building: Building) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isDarkMode, onBuildingClick, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t } = useLanguage();

  const categories = [
    { id: 'all', label: 'All Buildings', color: 'bg-gray-500' },
    { id: 'academic', label: 'Academic', color: 'bg-blue-500' },
    { id: 'dining', label: 'Dining', color: 'bg-red-500' },
    { id: 'student', label: 'Student Life', color: 'bg-pink-500' },
    { id: 'administrative', label: 'Administrative', color: 'bg-green-500' },
    { id: 'digital', label: 'Digital Services', color: 'bg-purple-500' }
  ];

  const socialMediaLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/uni.due.de',
      icon: <Facebook className="w-4 h-4" />,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/uni_due',
      icon: <Twitter className="w-4 h-4" />,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/uni_due',
      icon: <Instagram className="w-4 h-4" />,
      color: 'hover:text-pink-600'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/user/unidue',
      icon: <Youtube className="w-4 h-4" />,
      color: 'hover:text-red-600'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/school/university-of-duisburg-essen',
      icon: <Linkedin className="w-4 h-4" />,
      color: 'hover:text-blue-700'
    }
  ];

  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         building.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         building.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || building.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const quickAccessBuildings = buildings.filter(building => building.isMainBuilding);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed left-0 top-0 h-full w-96 z-50 shadow-2xl ${
              isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
            } backdrop-blur-xl border-r ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            } flex flex-col`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex-shrink-0`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('sidebar.exploreBuildings')}
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            {quickAccessBuildings.length > 0 && (
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex-shrink-0`}>
                <h3 className={`text-sm font-semibold mb-3 flex items-center space-x-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Star className="w-4 h-4" />
                  <span>{t('sidebar.quickAccess')}</span>
                </h3>
                <div className="space-y-2">
                  {quickAccessBuildings.map(building => (
                    <motion.button
                      key={building.id}
                      onClick={() => {
                        onBuildingClick(building);
                        onClose();
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        isDarkMode 
                          ? 'hover:bg-gray-800 text-gray-300' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: building.color }}
                        >
                          {building.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {building.name}
                          </h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {building.category}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Buildings List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {filteredBuildings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('search.noResults')}
                    </p>
                  </div>
                ) : (
                  filteredBuildings.map((building, index) => (
                    <motion.button
                      key={building.id}
                      onClick={() => {
                        onBuildingClick(building);
                        onClose();
                      }}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        isDarkMode 
                          ? 'hover:bg-gray-800 border border-gray-800 hover:border-gray-700' 
                          : 'hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                          style={{ backgroundColor: building.color }}
                        >
                          {building.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              {building.name}
                            </h4>
                            {building.isMainBuilding && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {building.category}
                          </p>
                          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {building.description}
                          </p>
                          
                          {/* Services Preview */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {building.services.slice(0, 3).map((service, serviceIndex) => (
                              <span
                                key={serviceIndex}
                                className={`px-2 py-1 rounded-md text-xs ${
                                  isDarkMode 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {service}
                              </span>
                            ))}
                            {building.services.length > 3 && (
                              <span className={`px-2 py-1 rounded-md text-xs ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                +{building.services.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Quick Info */}
                          <div className="mt-3 flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Open Now</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            {/* Social Media Footer */}
            <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex-shrink-0`}>
              <h3 className={`text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Follow UDE
              </h3>
              <div className="flex justify-center space-x-4">
                {socialMediaLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:bg-gray-800' 
                        : 'text-gray-600 hover:bg-gray-100'
                    } ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Follow us on ${social.name}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
              <p className={`text-xs text-center mt-3 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Stay connected with UDE
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;