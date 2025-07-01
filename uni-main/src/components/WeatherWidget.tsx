import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, CloudSnow, Zap, CloudDrizzle, AlertTriangle, RefreshCw, Settings, ExternalLink } from 'lucide-react';
import { weatherService, WeatherData } from '../services/weatherService';

interface WeatherWidgetProps {
  isDarkMode: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ isDarkMode }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showSetupHelp, setShowSetupHelp] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to get user's location first
      if (navigator.geolocation && weatherService.isConfigured()) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const weatherData = await weatherService.getWeatherByCoordinates(
                position.coords.latitude,
                position.coords.longitude
              );
              setWeather(weatherData);
              setLastUpdated(new Date());
            } catch (err) {
              // Fallback to default city
              await fetchDefaultCityWeather();
            } finally {
              setLoading(false);
            }
          },
          async () => {
            // Geolocation failed, use default city
            await fetchDefaultCityWeather();
          },
          { timeout: 5000 }
        );
      } else {
        await fetchDefaultCityWeather();
      }
    } catch (err) {
      await fetchDefaultCityWeather();
    }
  };

  const fetchDefaultCityWeather = async () => {
    try {
      if (!weatherService.isConfigured()) {
        // Fallback to simulated data if API is not configured
        setWeather({
          temperature: Math.round(15 + Math.random() * 15),
          condition: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)] as WeatherData['condition'],
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(5 + Math.random() * 20),
          visibility: Math.round(8 + Math.random() * 7),
          location: 'Essen, Germany',
          description: 'Simulated weather data',
          feelsLike: Math.round(17 + Math.random() * 15),
          pressure: Math.round(1000 + Math.random() * 50)
        });
        setError('API key not configured');
      } else {
        const weatherData = await weatherService.getCurrentWeather();
        setWeather(weatherData);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      
      // Fallback to simulated data
      setWeather({
        temperature: 20,
        condition: 'cloudy',
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        location: 'Essen, Germany',
        description: 'Fallback weather data',
        feelsLike: 22,
        pressure: 1013
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Refresh weather data every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'windy':
        return <Wind className="w-8 h-8 text-gray-600" />;
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-300" />;
      case 'thunderstorm':
        return <Zap className="w-8 h-8 text-yellow-600" />;
      case 'mist':
        return <CloudDrizzle className="w-8 h-8 text-gray-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'Sunny';
      case 'cloudy':
        return 'Cloudy';
      case 'rainy':
        return 'Rainy';
      case 'windy':
        return 'Windy';
      case 'snow':
        return 'Snow';
      case 'thunderstorm':
        return 'Thunderstorm';
      case 'mist':
        return 'Misty';
      default:
        return 'Clear';
    }
  };

  const getBackgroundGradient = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rainy':
        return 'from-blue-400 to-blue-600';
      case 'windy':
        return 'from-gray-500 to-gray-700';
      case 'snow':
        return 'from-blue-300 to-blue-500';
      case 'thunderstorm':
        return 'from-gray-700 to-gray-900';
      case 'mist':
        return 'from-gray-300 to-gray-500';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getWeatherTip = (condition: string, temperature: number) => {
    if (condition === 'rainy') return '☂️ Don\'t forget your umbrella!';
    if (condition === 'sunny' && temperature > 25) return '☀️ Perfect weather for campus walks!';
    if (condition === 'sunny') return '🌤️ Great day to be outside!';
    if (condition === 'cloudy') return '☁️ Comfortable weather for outdoor activities.';
    if (condition === 'windy') return '💨 A bit breezy today, dress accordingly.';
    if (condition === 'snow') return '❄️ Bundle up! It\'s snowing outside.';
    if (condition === 'thunderstorm') return '⛈️ Stay indoors during the storm.';
    if (condition === 'mist') return '🌫️ Visibility might be reduced.';
    return '🌤️ Have a great day!';
  };

  if (loading) {
    return (
      <div className={`w-80 p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
      } backdrop-blur-sm border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 bg-gray-300 rounded w-16 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={`w-80 p-6 rounded-2xl shadow-lg ${
        isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
      } backdrop-blur-sm border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="text-center">
          <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Unable to load weather data
          </p>
          <button
            onClick={fetchWeather}
            className={`mt-2 px-3 py-1 rounded text-xs ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-80 rounded-2xl shadow-lg overflow-hidden ${
        isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
      } backdrop-blur-sm border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-r ${getBackgroundGradient(weather.condition)} p-6 text-white relative`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">Weather</h3>
              {!weatherService.isConfigured() && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Demo</span>
              )}
            </div>
            <p className="text-sm opacity-90">{weather.location}</p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: weather.condition === 'windy' ? [0, 10, -10, 0] : 0,
                scale: weather.condition === 'thunderstorm' ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: weather.condition === 'windy' ? 2 : 1, 
                repeat: weather.condition === 'windy' || weather.condition === 'thunderstorm' ? Infinity : 0 
              }}
            >
              {getWeatherIcon(weather.condition)}
            </motion.div>
            <button
              onClick={fetchWeather}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Refresh weather"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{weather.temperature}°C</div>
            <div className="text-sm opacity-90 capitalize">{weather.description}</div>
          </div>
        </div>
      </div>

      {/* Weather details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Droplets className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Humidity</p>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weather.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Wind className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wind</p>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weather.windSpeed} km/h</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Eye className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Visibility</p>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weather.visibility} km</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Thermometer className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Feels like</p>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weather.feelsLike}°C</p>
            </div>
          </div>
        </div>

        {/* Weather tip */}
        <div className={`mt-4 p-3 rounded-lg ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {getWeatherTip(weather.condition, weather.temperature)}
          </p>
        </div>

        {/* Setup help for API configuration */}
        {!weatherService.isConfigured() && (
          <div className={`mt-4 p-3 rounded-lg border-2 border-dashed ${
            isDarkMode ? 'border-yellow-600 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-50'
          }`}>
            <div className="flex items-start space-x-2">
              <Settings className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div className="flex-1">
                <p className={`text-xs font-medium ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Using simulated weather data
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  Configure OpenWeatherMap API for real data
                </p>
                <button
                  onClick={() => setShowSetupHelp(!showSetupHelp)}
                  className={`text-xs mt-2 underline ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}
                >
                  {showSetupHelp ? 'Hide setup' : 'Show setup instructions'}
                </button>
              </div>
            </div>
            
            {showSetupHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-yellow-400/30"
              >
                <div className={`text-xs space-y-2 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  <p className="font-medium">Quick Setup:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>
                      <a 
                        href="https://openweathermap.org/api" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:no-underline inline-flex items-center"
                      >
                        Get free API key <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </li>
                    <li>Create <code className="bg-black/20 px-1 rounded">.env</code> file in project root</li>
                    <li>Add: <code className="bg-black/20 px-1 rounded">VITE_OPENWEATHER_API_KEY=your_key</code></li>
                    <li>Restart the development server</li>
                  </ol>
                  <p className="text-xs opacity-75 mt-2">
                    API keys may take up to 2 hours to activate
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Error message for API issues */}
        {error && error !== 'API key not configured' && (
          <div className={`mt-2 p-2 rounded text-xs ${
            isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <div className={`mt-2 text-xs text-center ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherWidget;