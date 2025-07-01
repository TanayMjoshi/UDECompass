import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Map, ChevronDown, ChevronRight, Moon, Sun, Clock, MapPin, Users, MessageSquare } from 'lucide-react';
import { Building, BuildingPageData } from '../types/Building';
import { useLanguage } from '../contexts/LanguageContext';
import Forum from './Forum';

interface BuildingPageProps {
  building: Building;
  pageData: BuildingPageData;
  isDarkMode: boolean;
  onBack: () => void;
}

const BuildingPage: React.FC<BuildingPageProps> = ({ building, pageData, isDarkMode: globalDarkMode, onBack }) => {
  const { t, language } = useLanguage();
  const [expandedMaps, setExpandedMaps] = useState<Record<string, boolean>>({});
  const [localDarkMode, setLocalDarkMode] = useState(globalDarkMode);
  const [showForum, setShowForum] = useState(false);

  const toggleMapExpansion = (mapTitle: string) => {
    setExpandedMaps(prev => ({
      ...prev,
      [mapTitle]: !prev[mapTitle]
    }));
  };

  // Get contextual background based on building type and mode
  const getContextualBackground = () => {
    const baseGradient = localDarkMode 
      ? 'linear-gradient(135deg, #1f2937, #111827, #0f172a)'
      : 'linear-gradient(135deg, #fef3c7, #fed7aa, #fef3c7)';

    switch (building.id) {
      case 'library':
        return {
          background: localDarkMode
            ? `${baseGradient}, url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `${baseGradient}, url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        };
      
      default:
        return { background: baseGradient };
    }
  };

  // Get localized links based on language
  const getLocalizedLinks = () => {
    return pageData.links.map(link => {
      if (language === 'de') {
        const germanUrls: Record<string, string> = {
          'https://www.uni-due.de/ub/en/atoz/access-from-home.php': 'https://www.uni-due.de/ub/abisz/zugriff_von_zuhause.php',
          'https://primo.uni-due.de/discovery/search?vid=49HBZ_UDE:UDE&lang=en': 'https://primo.uni-due.de/discovery/search?vid=49HBZ_UDE:UDE',
          'https://www.uni-due.de/en/organisation.php': 'https://www.uni-due.de/de/organisation/',
          'https://www.uni-due.de/career/': 'https://www.uni-due.de/karriere/',
          'https://www.uni-due.de/en/studying/counselling.php': 'https://www.uni-due.de/de/studium/beratung.php',
          'https://www.stw-edu.de/en/catering/menus': 'https://www.stw-edu.de/gastronomie/speiseplaene',
          'https://www.uni-due.de/welcome-centre/en/visa_en.php': 'https://www.uni-due.de/welcome-centre/visa.php',
          'https://www.uni-due.de/welcome-centre/en/vde_check.php': 'https://www.uni-due.de/welcome-centre/vde_checkliste.php',
          'https://www.uni-due.de/international/abh_en': 'https://www.uni-due.de/international/abh',
          'https://www.uni-due.de/en/current.php': 'https://www.uni-due.de/de/studium/organisation.php',
          'https://www.uni-due.de/en/studying/application.php': 'https://www.uni-due.de/de/studium/bewerbung.php',
          'https://www.uni-due.de/en/studying/funding.php': 'https://www.uni-due.de/de/studium/foerderung.php',
          'https://www.stw-edu.de/en/': 'https://www.stw-edu.de/',
          'https://www.uni-due.de/zim/services/moodle/index_eng.php': 'https://www.uni-due.de/zim/services/moodle/',
          'https://www.uni-due.de/en/university_addresses.shtml': 'https://www.uni-due.de/de/universitaet/orientierung.php'
        };

        return {
          ...link,
          url: germanUrls[link.url] || link.url
        };
      }
      return link;
    });
  };

  const backgroundStyle = getContextualBackground();

  // If showing forum, render the forum component
  if (showForum) {
    return (
      <Forum 
        isDarkMode={localDarkMode} 
        onBack={() => setShowForum(false)}
      />
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={backgroundStyle}
    >
      {/* Apple-style Header */}
      <div className={`w-full ${
        localDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
      } backdrop-blur-xl border-b ${
        localDarkMode ? 'border-gray-800' : 'border-gray-100'
      } shadow-sm sticky top-0 z-50`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all ${
                  localDarkMode ? 'hover:bg-gray-800 text-gray-200' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">{t('header.back')}</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setLocalDarkMode(!localDarkMode)}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                localDarkMode 
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              title={localDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {localDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Building Header */}
          <div className="flex items-center space-x-4 mt-4">
            <div 
              className="p-4 rounded-2xl shadow-lg"
              style={{ backgroundColor: building.color }}
            >
              <div className="text-white text-2xl">
                {building.icon}
              </div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${localDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t(`building.${building.id}`) || pageData.title}
              </h1>
              <p className={`text-base ${localDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t(`building.${building.id}.category`) || building.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Apple-style spacing */}
      <div className="px-6 py-8 space-y-8">
        {/* Hero Description */}
        <div className={`rounded-3xl p-8 ${
          localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-xl border ${
          localDarkMode ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg`}>
          <p className={`text-lg leading-relaxed ${
            localDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {pageData.description}
          </p>
        </div>

        {/* Forum Access Button for Student Center */}
        {pageData.showForum && (
          <div className={`rounded-3xl p-8 ${
            localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
          } backdrop-blur-xl border ${
            localDarkMode ? 'border-gray-700' : 'border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-xl font-bold mb-2 flex items-center space-x-3 ${
                  localDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                  <span>Student Forum</span>
                </h3>
                <p className={`text-base ${
                  localDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Join discussions, ask questions, and connect with fellow students in our community forum.
                </p>
              </div>
              <button
                onClick={() => setShowForum(true)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                  localDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } shadow-lg hover:shadow-xl`}
              >
                Open Forum
              </button>
            </div>
          </div>
        )}

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-2xl ${
            localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
          } backdrop-blur-xl border ${
            localDarkMode ? 'border-gray-700' : 'border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className={`font-semibold ${localDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Hours
              </h3>
            </div>
            <p className={`text-sm ${localDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Mon-Fri: 8AM-10PM<br />
              Sat-Sun: 9AM-8PM
            </p>
          </div>

          <div className={`p-6 rounded-2xl ${
            localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
          } backdrop-blur-xl border ${
            localDarkMode ? 'border-gray-700' : 'border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="w-5 h-5 text-green-500" />
              <h3 className={`font-semibold ${localDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Location
              </h3>
            </div>
            <p className={`text-sm ${localDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Campus Center<br />
              Building A, Floor 1
            </p>
          </div>

          <div className={`p-6 rounded-2xl ${
            localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
          } backdrop-blur-xl border ${
            localDarkMode ? 'border-gray-700' : 'border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center space-x-3 mb-3">
              <Users className="w-5 h-5 text-purple-500" />
              <h3 className={`font-semibold ${localDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Capacity
              </h3>
            </div>
            <p className={`text-sm ${localDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              200+ Students<br />
              Multiple Floors
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className={`rounded-3xl p-8 ${
          localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-xl border ${
          localDarkMode ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg`}>
          <h3 className={`text-xl font-bold mb-6 ${
            localDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('page.availableServices')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {building.services.map((service, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-2xl ${
                  localDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: building.color }}
                />
                <span className={`font-medium ${
                  localDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {service}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className={`rounded-3xl p-8 ${
          localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-xl border ${
          localDarkMode ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg`}>
          <h3 className={`text-xl font-bold mb-6 ${
            localDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('page.quickLinks')}
          </h3>
          <div className="space-y-4">
            {getLocalizedLinks().map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-6 rounded-2xl transition-all ${
                  localDarkMode 
                    ? 'bg-gray-700/30 hover:bg-gray-700/50 text-gray-200' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                } hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold mb-2 ${
                      localDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {link.title}
                    </h4>
                    <p className={`text-sm ${
                      localDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Maps Section - Only for UDE Portals */}
        {pageData.maps && (
          <div className={`rounded-3xl p-8 ${
            localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
          } backdrop-blur-xl border ${
            localDarkMode ? 'border-gray-700' : 'border-gray-200'
          } shadow-lg`}>
            <h3 className={`text-xl font-bold mb-6 flex items-center space-x-3 ${
              localDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Map className="w-6 h-6" />
              <span>{t('page.campusMaps')}</span>
            </h3>
            <div className="space-y-4">
              {pageData.maps.map((map, index) => (
                <div key={index} className={`border rounded-2xl ${
                  localDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {/* Main Map */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <a
                        href={map.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 hover:underline ${
                          localDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}
                      >
                        <h4 className="font-semibold flex items-center space-x-3 mb-2">
                          <Map className="w-5 h-5" />
                          <span>{map.title}</span>
                          <ExternalLink className="w-4 h-4" />
                        </h4>
                        <p className={`text-sm ${
                          localDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {map.description}
                        </p>
                      </a>
                      {map.submaps && (
                        <button
                          onClick={() => toggleMapExpansion(map.title)}
                          className={`ml-4 p-3 rounded-2xl transition-colors ${
                            localDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          {expandedMaps[map.title] ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submaps */}
                  {map.submaps && expandedMaps[map.title] && (
                    <div className={`border-t px-6 pb-6 ${
                      localDarkMode ? 'border-gray-600 bg-gray-700/20' : 'border-gray-300 bg-gray-50'
                    }`}>
                      <div className="space-y-3 mt-6">
                        {map.submaps.map((submap, subIndex) => (
                          <a
                            key={subIndex}
                            href={submap.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block p-4 rounded-2xl transition-all ${
                              localDarkMode 
                                ? 'bg-gray-600/30 hover:bg-gray-600/50 text-gray-200' 
                                : 'bg-white hover:bg-gray-50 text-gray-700'
                            } hover:scale-[1.01]`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className={`font-medium ${
                                  localDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {submap.title}
                                </h5>
                                <p className={`text-sm mt-1 ${
                                  localDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {submap.description}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Content */}
        <div className={`rounded-3xl p-8 ${
          localDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-xl border ${
          localDarkMode ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg`}>
          <div 
            className={`prose prose-lg max-w-none ${
              localDarkMode ? 'prose-invert' : ''
            }`}
            style={{
              color: localDarkMode ? '#e5e7eb' : '#374151'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingPage;