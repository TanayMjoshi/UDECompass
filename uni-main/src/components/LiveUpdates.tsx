import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, Users, Utensils, BookOpen, AlertCircle, Calendar, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LiveUpdate {
  id: string;
  type: 'event' | 'alert' | 'service' | 'announcement' | 'webmail';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  building?: string;
  icon: React.ReactNode;
  actionUrl?: string;
  actionText?: string;
}

interface LiveUpdatesProps {
  isDarkMode: boolean;
  isExpanded?: boolean;
}

const LiveUpdates: React.FC<LiveUpdatesProps> = ({ isDarkMode, isExpanded = false }) => {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [showNotifications, setShowNotifications] = useState(isExpanded);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t, language } = useLanguage();

  // Generate contextual updates
  useEffect(() => {
    const generateContextualUpdate = (): LiveUpdate => {
      const currentHour = new Date().getHours();
      const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Time-based contextual updates
      const contextualUpdates = [];

      // Webmail notification (always relevant)
      contextualUpdates.push({
        type: 'webmail' as const,
        title: language === 'en' ? 'Check Your UDE Email' : 'UDE E-Mail prüfen',
        message: language === 'en' 
          ? 'You have unread messages in your university email account. Stay connected with important updates.'
          : 'Sie haben ungelesene Nachrichten in Ihrem Universitäts-E-Mail-Konto. Bleiben Sie über wichtige Updates informiert.',
        priority: 'medium' as const,
        icon: <Mail className="w-4 h-4" />,
        actionUrl: 'https://www.uni-due.de/zim/services/e-mail/webmail_login.php',
        actionText: language === 'en' ? 'Open Webmail' : 'Webmail öffnen'
      });

      // Morning updates (6 AM - 11 AM)
      if (currentHour >= 6 && currentHour < 11) {
        contextualUpdates.push({
          type: 'service' as const,
          title: language === 'en' ? 'Morning Coffee Available' : 'Morgenkaffee verfügbar',
          message: language === 'en' 
            ? 'Start your day right! Fresh coffee and breakfast options are now available at the cafeteria.'
            : 'Starten Sie richtig in den Tag! Frischer Kaffee und Frühstücksoptionen sind jetzt in der Cafeteria verfügbar.',
          priority: 'low' as const,
          building: 'cafeteria',
          icon: <Utensils className="w-4 h-4" />
        });
      }

      // Lunch time updates (11 AM - 2 PM)
      if (currentHour >= 11 && currentHour < 14) {
        contextualUpdates.push({
          type: 'service' as const,
          title: language === 'en' ? 'Lunch Menu Available' : 'Mittagsmenü verfügbar',
          message: language === 'en' 
            ? "Today's lunch special includes vegetarian and international options. Check out our weekly menu online!"
            : 'Das heutige Mittagsspecial umfasst vegetarische und internationale Optionen. Schauen Sie sich unseren Wochenplan online an!',
          priority: 'medium' as const,
          building: 'cafeteria',
          icon: <Utensils className="w-4 h-4" />,
          actionUrl: 'https://www.stw-edu.de/gastronomie/speiseplaene',
          actionText: language === 'en' ? 'View Menu' : 'Menü anzeigen'
        });
      }

      // Study time updates (2 PM - 8 PM)
      if (currentHour >= 14 && currentHour < 20) {
        contextualUpdates.push({
          type: 'service' as const,
          title: language === 'en' ? 'Study Rooms Available' : 'Lernräume verfügbar',
          message: language === 'en' 
            ? 'Quiet study spaces are available at the Central Library. Book your room online for focused study time.'
            : 'Ruhige Lernräume sind in der Zentralbibliothek verfügbar. Buchen Sie Ihren Raum online für konzentrierte Lernzeit.',
          priority: 'medium' as const,
          building: 'library',
          icon: <BookOpen className="w-4 h-4" />,
          actionUrl: 'https://www.uni-due.de/ub/lernenundarbeiten.php',
          actionText: language === 'en' ? 'Book Room' : 'Raum buchen'
        });
      }

      // Evening updates (6 PM - 10 PM)
      if (currentHour >= 18 && currentHour < 22) {
        contextualUpdates.push({
          type: 'event' as const,
          title: language === 'en' ? 'Evening Study Groups' : 'Abend-Lerngruppen',
          message: language === 'en' 
            ? 'Join evening study groups for collaborative learning. Check the Student Center for available sessions.'
            : 'Nehmen Sie an Abend-Lerngruppen für kollaboratives Lernen teil. Schauen Sie im Studierendenzentrum nach verfügbaren Sitzungen.',
          priority: 'low' as const,
          building: 'student-center',
          icon: <Users className="w-4 h-4" />
        });
      }

      // Weekday-specific updates
      if (currentDay >= 1 && currentDay <= 5) { // Monday to Friday
        contextualUpdates.push({
          type: 'announcement' as const,
          title: language === 'en' ? 'Administrative Services Open' : 'Verwaltungsservices geöffnet',
          message: language === 'en' 
            ? 'All administrative offices are open today. Visit for student registration, academic records, and other services.'
            : 'Alle Verwaltungsbüros sind heute geöffnet. Besuchen Sie uns für Studierendenregistrierung, akademische Unterlagen und andere Services.',
          priority: 'low' as const,
          building: 'administration',
          icon: <Clock className="w-4 h-4" />
        });
      }

      // Weekend updates
      if (currentDay === 0 || currentDay === 6) { // Saturday or Sunday
        contextualUpdates.push({
          type: 'service' as const,
          title: language === 'en' ? 'Weekend Library Hours' : 'Wochenend-Bibliothekszeiten',
          message: language === 'en' 
            ? 'The library is open with reduced hours on weekends. Perfect for quiet study sessions!'
            : 'Die Bibliothek ist am Wochenende mit reduzierten Öffnungszeiten geöffnet. Perfekt für ruhige Lernsitzungen!',
          priority: 'medium' as const,
          building: 'library',
          icon: <BookOpen className="w-4 h-4" />
        });
      }

      // Visa services reminder (for international students)
      if (currentDay >= 1 && currentDay <= 4) { // Monday to Thursday
        contextualUpdates.push({
          type: 'alert' as const,
          title: language === 'en' ? 'Visa Services Available' : 'Visa-Services verfügbar',
          message: language === 'en' 
            ? 'International students: Visa consultation services are available. Book an appointment for document verification.'
            : 'Internationale Studierende: Visa-Beratungsservices sind verfügbar. Buchen Sie einen Termin für die Dokumentenprüfung.',
          priority: 'medium' as const,
          building: 'visa-services',
          icon: <AlertCircle className="w-4 h-4" />,
          actionUrl: 'https://www.uni-due.de/international/abh',
          actionText: language === 'en' ? 'Book Appointment' : 'Termin buchen'
        });
      }

      // Return a random contextual update
      return {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date(),
        ...contextualUpdates[Math.floor(Math.random() * contextualUpdates.length)]
      };
    };

    // Add initial contextual updates
    const initialUpdates = Array.from({ length: 2 }, generateContextualUpdate);
    setUpdates(initialUpdates);
    setUnreadCount(initialUpdates.length);

    // Add new contextual updates periodically (every 30 seconds for demo)
    const interval = setInterval(() => {
      const newUpdate = generateContextualUpdate();
      setUpdates(prev => [newUpdate, ...prev.slice(0, 7)]); // Keep only 8 most recent
      setUnreadCount(prev => prev + 1);
    }, 30000); // New update every 30 seconds

    return () => clearInterval(interval);
  }, [language]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  const handleUpdateAction = (update: LiveUpdate) => {
    if (update.actionUrl) {
      window.open(update.actionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-purple-500';
      case 'alert': return 'bg-red-500';
      case 'service': return 'bg-green-500';
      case 'announcement': return 'bg-blue-500';
      case 'webmail': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  // If used as expanded component (in mobile view), render differently
  if (isExpanded) {
    return (
      <div className={`rounded-xl ${
        isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
      } backdrop-blur-sm border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } shadow-lg`}>
        <div className={`p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {t('updates.title')}
          </h3>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="p-4 text-center">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('updates.noUpdates')}
              </p>
            </div>
          ) : (
            updates.map((update) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 border-b last:border-b-0 hover:bg-opacity-50 transition-colors ${
                  isDarkMode 
                    ? 'border-gray-700 hover:bg-gray-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(update.type)}`}>
                    {update.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-medium text-sm ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {update.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getPriorityColor(update.priority)
                      }`}>
                        {t(`priority.${update.priority}`)}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {update.message}
                    </p>
                    
                    {/* Action Button */}
                    {update.actionUrl && update.actionText && (
                      <button
                        onClick={() => handleUpdateAction(update)}
                        className={`mt-2 inline-flex items-center space-x-1 text-xs px-3 py-1 rounded-full transition-colors ${
                          update.type === 'webmail'
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}
                      >
                        <span>{update.actionText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {update.building && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {update.building.replace('-', ' ')}
                        </span>
                      )}
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {update.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Regular notification bell for desktop
  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={handleNotificationClick}
          className={`p-2 rounded-lg transition-colors relative ${
            isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </button>

        {/* Notifications Dropdown - Fixed Z-Index */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute right-0 top-12 w-96 max-h-96 overflow-y-auto rounded-xl shadow-2xl border z-[1000] ${
                isDarkMode 
                  ? 'bg-gray-800/95 border-gray-700' 
                  : 'bg-white/95 border-gray-200'
              } backdrop-blur-sm`}
            >
              <div className={`p-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {t('updates.title')}
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className={`p-1 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {updates.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t('updates.noUpdates')}
                    </p>
                  </div>
                ) : (
                  updates.map((update) => (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-b last:border-b-0 hover:bg-opacity-50 transition-colors ${
                        isDarkMode 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(update.type)}`}>
                          {update.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium text-sm ${
                              isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                              {update.title}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              getPriorityColor(update.priority)
                            }`}>
                              {t(`priority.${update.priority}`)}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {update.message}
                          </p>
                          
                          {/* Action Button */}
                          {update.actionUrl && update.actionText && (
                            <button
                              onClick={() => handleUpdateAction(update)}
                              className={`mt-2 inline-flex items-center space-x-1 text-xs px-3 py-1 rounded-full transition-colors ${
                                update.type === 'webmail'
                                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}
                            >
                              <span>{update.actionText}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            {update.building && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isDarkMode 
                                  ? 'bg-gray-700 text-gray-300' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {update.building.replace('-', ' ')}
                              </span>
                            )}
                            <span className={`text-xs ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {update.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LiveUpdates;