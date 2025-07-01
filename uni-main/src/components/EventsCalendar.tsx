import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Globe,
  GraduationCap,
  Heart,
  Palette,
  Trophy,
  Search,
  X,
  Bookmark,
  Share2
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { CampusEvent } from '../types/Events';
import { getCampusEvents, getUpcomingEvents, searchEvents } from '../services/eventsService';
import { useLanguage } from '../contexts/LanguageContext';

interface EventsCalendarProps {
  isDarkMode: boolean;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ isDarkMode }) => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [ setUpcomingEvents] = useState<CampusEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { language } = useLanguage();

  const categories = [
    { id: 'all', label: language === 'en' ? 'All Events' : 'Alle Veranstaltungen', icon: Calendar, color: 'bg-gray-500' },
    { id: 'academic', label: language === 'en' ? 'Academic' : 'Akademisch', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'international', label: language === 'en' ? 'International' : 'International', icon: Globe, color: 'bg-green-500' },
    { id: 'social', label: language === 'en' ? 'Social' : 'Sozial', icon: Heart, color: 'bg-pink-500' },
    { id: 'cultural', label: language === 'en' ? 'Cultural' : 'Kulturell', icon: Palette, color: 'bg-purple-500' },
    { id: 'sports', label: language === 'en' ? 'Sports' : 'Sport', icon: Trophy, color: 'bg-orange-500' }
  ];

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const [allEvents, upcoming] = await Promise.all([
        searchQuery ? searchEvents(searchQuery) : getCampusEvents(),
        getUpcomingEvents(5)
      ]);
      setEvents(allEvents);
      // setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [searchQuery]);

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, date));
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    if (!categoryData) return Calendar;
    return categoryData.icon;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-500',
      international: 'bg-green-500',
      social: 'bg-pink-500',
      cultural: 'bg-purple-500',
      sports: 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`p-2 text-center text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {day}
            </div>
          ))}
          
          {days.map(day => {
            const dayEvents = getEventsForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            
            return (
              <motion.button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 text-sm rounded-lg transition-colors relative ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : isCurrentDay
                      ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                      : isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {format(day, 'd')}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className={`w-1 h-1 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-blue-500'
                    }`} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected Date Events */}
        <div className="space-y-2">
          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Events on {format(selectedDate, 'MMMM d, yyyy')}
          </h4>
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No events scheduled for this date.
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {getEventsForDate(selectedDate).map(event => (
                <EventCard key={event.id} event={event} isDarkMode={isDarkMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {language === 'en' ? 'Upcoming Events' : 'Kommende Veranstaltungen'}
      </h3>
      {filteredEvents.length === 0 ? (
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {language === 'en' ? 'No events found for the selected category.' : 'Keine Veranstaltungen für die ausgewählte Kategorie gefunden.'}
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredEvents.slice(0, 10).map(event => (
            <EventCard key={event.id} event={event} isDarkMode={isDarkMode} />
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <motion.div
        className={`p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
        } backdrop-blur-sm border ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg w-96`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Calendar className="w-5 h-5 text-blue-500" />
          </motion.div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' ? 'Loading events...' : 'Lade Veranstaltungen...'}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`p-6 rounded-xl ${
        isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
      } backdrop-blur-sm border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } shadow-lg w-96`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {language === 'en' ? 'Campus Events' : 'Campus-Veranstaltungen'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-500 text-white' 
                : isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {viewMode === 'calendar' 
              ? (language === 'en' ? 'List View' : 'Listenansicht')
              : (language === 'en' ? 'Calendar View' : 'Kalenderansicht')
            }
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={language === 'en' ? 'Search events...' : 'Veranstaltungen suchen...'}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'calendar' ? renderCalendarView() : renderListView()}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className={`mt-4 pt-4 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <motion.button
          onClick={() => window.open('https://www.uni-due.de/en/events.php', '_blank')}
          className={`w-full text-center text-sm font-medium transition-colors ${
            isDarkMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-700'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          {language === 'en' ? 'View All Events' : 'Alle Veranstaltungen anzeigen'}
        </motion.button>
      </div>
    </motion.div>
  );
};

const EventCard: React.FC<{ event: CampusEvent; isDarkMode: boolean }> = ({ event, isDarkMode }) => {
  const { language } = useLanguage();
  
  const Icon = event.category === 'academic' ? GraduationCap :
              event.category === 'international' ? Globe :
              event.category === 'social' ? Heart :
              event.category === 'cultural' ? Palette :
              event.category === 'sports' ? Trophy : Calendar;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${event.title} - ${event.description}`);
    }
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${
        isDarkMode ? 'bg-gray-700/80 border-gray-600' : 'bg-white border-gray-200'
      } shadow-sm`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          event.category === 'academic' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
          event.category === 'international' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
          event.category === 'social' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' :
          event.category === 'cultural' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
          event.category === 'sports' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
          'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {event.title}
            </h4>
            <div className="flex items-center space-x-1 ml-2">
              <motion.button
                onClick={handleShare}
                className={`p-1 rounded transition-colors ${
                  isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Share event"
              >
                <Share2 className="w-3 h-3" />
              </motion.button>
              <motion.button
                className={`p-1 rounded transition-colors ${
                  isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Bookmark event"
              >
                <Bookmark className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
          
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
            {event.description}
          </p>
          
          <div className={`flex items-center space-x-4 mt-2 text-xs ${
            isDarkMode ? 'text-gray-300' : 'text-gray-500'
          }`}>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{format(event.date, 'MMM d')} • {event.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
            {event.maxParticipants && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{event.currentParticipants || 0}/{event.maxParticipants}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode 
                      ? 'bg-gray-600/50 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {event.registrationRequired && event.registrationUrl && (
            <motion.a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 mt-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              whileHover={{ scale: 1.05 }}
            >
              <span>{language === 'en' ? 'Register' : 'Anmelden'}</span>
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventsCalendar;