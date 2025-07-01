import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  BookOpen,
  Utensils,
  FileText,
  Users,
  Building2,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  quickActions?: QuickAction[];
}

interface QuickAction {
  id: string;
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

interface ChatAssistantProps {
  isDarkMode: boolean;
  isMobile?: boolean;
  onBuildingSelect?: (buildingId: string) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  isDarkMode, 
  isMobile = false,
  onBuildingSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: language === 'en' 
          ? `Hello ${user?.name || 'Student'}! 👋 I'm your UDE Campus Assistant. I can help you navigate the campus, find buildings, check services, and answer questions about university life. How can I assist you today?`
          : `Hallo ${user?.name || 'Student'}! 👋 Ich bin Ihr UDE Campus-Assistent. Ich kann Ihnen helfen, sich auf dem Campus zurechtzufinden, Gebäude zu finden, Services zu überprüfen und Fragen zum Universitätsleben zu beantworten. Wie kann ich Ihnen heute helfen?`,
        timestamp: new Date(),
        suggestions: language === 'en' 
          ? ['Find the library', 'Show dining options', 'Campus map', 'Contact information']
          : ['Bibliothek finden', 'Speisemöglichkeiten zeigen', 'Campus-Karte', 'Kontaktinformationen'],
        quickActions: [
          {
            id: 'library',
            label: language === 'en' ? 'Library' : 'Bibliothek',
            action: () => onBuildingSelect?.('library'),
            icon: <BookOpen className="w-4 h-4" />
          },
          {
            id: 'cafeteria',
            label: language === 'en' ? 'Cafeteria' : 'Cafeteria',
            action: () => onBuildingSelect?.('cafeteria'),
            icon: <Utensils className="w-4 h-4" />
          },
          {
            id: 'student-center',
            label: language === 'en' ? 'Student Center' : 'Studierendenzentrum',
            action: () => onBuildingSelect?.('student-center'),
            icon: <Users className="w-4 h-4" />
          }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language, user, onBuildingSelect]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const playNotificationSound = () => {
    if (soundEnabled) {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const generateResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let quickActions: QuickAction[] = [];

    // Building-specific responses
    if (lowerMessage.includes('library') || lowerMessage.includes('bibliothek')) {
      response = language === 'en' 
        ? 'The Central Library is your gateway to academic excellence! 📚 It offers digital resources, study rooms, research support, and printing services. Open Monday-Friday 8AM-10PM, weekends with reduced hours.'
        : 'Die Zentralbibliothek ist Ihr Tor zur akademischen Exzellenz! 📚 Sie bietet digitale Ressourcen, Lernräume, Forschungsunterstützung und Druckdienste. Geöffnet Montag-Freitag 8-22 Uhr, Wochenenden mit reduzierten Öffnungszeiten.';
      
      quickActions = [{
        id: 'library-visit',
        label: language === 'en' ? 'Visit Library' : 'Bibliothek besuchen',
        action: () => onBuildingSelect?.('library'),
        icon: <MapPin className="w-4 h-4" />
      }];
    } else if (lowerMessage.includes('cafeteria') || lowerMessage.includes('mensa') || lowerMessage.includes('food') || lowerMessage.includes('essen')) {
      response = language === 'en' 
        ? 'The Cafeteria/Mensa offers delicious and affordable meals! 🍽️ We have daily menus, vegetarian options, international cuisine, and coffee & snacks. Student-friendly prices with meal plans available.'
        : 'Die Cafeteria/Mensa bietet köstliche und erschwingliche Mahlzeiten! 🍽️ Wir haben Tagesmenüs, vegetarische Optionen, internationale Küche und Kaffee & Snacks. Studentenfreundliche Preise mit verfügbaren Menüplänen.';
      
      quickActions = [{
        id: 'cafeteria-visit',
        label: language === 'en' ? 'Visit Cafeteria' : 'Cafeteria besuchen',
        action: () => onBuildingSelect?.('cafeteria'),
        icon: <MapPin className="w-4 h-4" />
      }];
    } else if (lowerMessage.includes('visa') || lowerMessage.includes('immigration')) {
      response = language === 'en' 
        ? 'Our Visa Services provide comprehensive immigration support! 📋 We help with visa applications, residence permits, document verification, and immigration consultation. Office hours: Monday-Friday 9AM-4PM.'
        : 'Unsere Visa-Services bieten umfassende Einwanderungsunterstützung! 📋 Wir helfen bei Visa-Anträgen, Aufenthaltsgenehmigungen, Dokumentenprüfung und Einwanderungsberatung. Bürozeiten: Montag-Freitag 9-16 Uhr.';
      
      quickActions = [{
        id: 'visa-visit',
        label: language === 'en' ? 'Visit Visa Services' : 'Visa-Services besuchen',
        action: () => onBuildingSelect?.('visa-services'),
        icon: <MapPin className="w-4 h-4" />
      }];
    } else if (lowerMessage.includes('student center') || lowerMessage.includes('studierendenzentrum') || lowerMessage.includes('activities')) {
      response = language === 'en' 
        ? 'The Student Center is the hub of campus life! 👥 Join student organizations, attend events, access counseling services, career guidance, and participate in our community forum. Over 100 organizations to choose from!'
        : 'Das Studierendenzentrum ist das Zentrum des Campus-Lebens! 👥 Treten Sie Studierendenorganisationen bei, besuchen Sie Veranstaltungen, nutzen Sie Beratungsdienste, Karriereberatung und nehmen Sie an unserem Community-Forum teil. Über 100 Organisationen zur Auswahl!';
      
      quickActions = [{
        id: 'student-center-visit',
        label: language === 'en' ? 'Visit Student Center' : 'Studierendenzentrum besuchen',
        action: () => onBuildingSelect?.('student-center'),
        icon: <MapPin className="w-4 h-4" />
      }];
    } else if (lowerMessage.includes('administration') || lowerMessage.includes('verwaltung') || lowerMessage.includes('registration')) {
      response = language === 'en' 
        ? 'The Administration Building handles all central services! 🏢 Student registration, academic records, financial aid, examination office, and international student support. Open Monday-Thursday 8AM-4PM, Friday 8AM-2PM.'
        : 'Das Verwaltungsgebäude übernimmt alle zentralen Dienstleistungen! 🏢 Studierendenregistrierung, akademische Unterlagen, Finanzbeihilfe, Prüfungsamt und internationale Studierendenbetreuung. Geöffnet Montag-Donnerstag 8-16 Uhr, Freitag 8-14 Uhr.';
      
      quickActions = [{
        id: 'admin-visit',
        label: language === 'en' ? 'Visit Administration' : 'Verwaltung besuchen',
        action: () => onBuildingSelect?.('administration'),
        icon: <MapPin className="w-4 h-4" />
      }];
    } else if (lowerMessage.includes('portal') || lowerMessage.includes('online') || lowerMessage.includes('digital') || lowerMessage.includes('moodle')) {
      response = language === 'en' 
        ? 'UDE Portals provide access to all digital services! 💻 Including Moodle LMS, student portals, email access, campus maps, and communication channels like WhatsApp groups and Discord server.'
        : 'UDE-Portale bieten Zugang zu allen digitalen Diensten! 💻 Einschließlich Moodle LMS, Studierendenportale, E-Mail-Zugang, Campus-Karten und Kommunikationskanäle wie WhatsApp-Gruppen und Discord-Server.';
      
      quickActions = [{
        id: 'portals-visit',
        label: language === 'en' ? 'Visit Portals' : 'Portale besuchen',
        action: () => onBuildingSelect?.('ude-portals'),
        icon: <MapPin className="w-4 h-4" />
      }];
    } else if (lowerMessage.includes('hours') || lowerMessage.includes('time') || lowerMessage.includes('open') || lowerMessage.includes('öffnungszeiten')) {
      response = language === 'en' 
        ? 'Here are the general operating hours:\n\n📚 Library: Mon-Fri 8AM-10PM, Sat 9AM-8PM, Sun 10AM-6PM\n🍽️ Cafeteria: Mon-Fri 11AM-3PM, Sat 12PM-2PM\n🏢 Administration: Mon-Thu 8AM-4PM, Fri 8AM-2PM\n📋 Visa Services: Mon-Fri 9AM-4PM'
        : 'Hier sind die allgemeinen Öffnungszeiten:\n\n📚 Bibliothek: Mo-Fr 8-22 Uhr, Sa 9-20 Uhr, So 10-18 Uhr\n🍽️ Cafeteria: Mo-Fr 11-15 Uhr, Sa 12-14 Uhr\n🏢 Verwaltung: Mo-Do 8-16 Uhr, Fr 8-14 Uhr\n📋 Visa-Services: Mo-Fr 9-16 Uhr';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('kontakt')) {
      response = language === 'en' 
        ? 'Contact Information:\n\n📞 Main Campus: +49 203 379-0\n📧 General Info: info@uni-due.de\n🌐 Website: www.uni-due.de\n📍 Campus Essen: Universitätsstraße 2, 45141 Essen\n📍 Campus Duisburg: Forsthausweg 2, 47057 Duisburg'
        : 'Kontaktinformationen:\n\n📞 Hauptcampus: +49 203 379-0\n📧 Allgemeine Info: info@uni-due.de\n🌐 Website: www.uni-due.de\n📍 Campus Essen: Universitätsstraße 2, 45141 Essen\n📍 Campus Duisburg: Forsthausweg 2, 47057 Duisburg';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('hilfe') || lowerMessage.includes('support')) {
      response = language === 'en' 
        ? 'I\'m here to help! I can assist you with:\n\n🏛️ Finding buildings and services\n📍 Campus navigation\n⏰ Operating hours and schedules\n📞 Contact information\n🎓 Student services and support\n💻 Digital platforms and portals\n\nJust ask me anything about UDE!'
        : 'Ich bin hier, um zu helfen! Ich kann Ihnen helfen bei:\n\n🏛️ Gebäude und Services finden\n📍 Campus-Navigation\n⏰ Öffnungszeiten und Zeitpläne\n📞 Kontaktinformationen\n🎓 Studierendenservices und Unterstützung\n💻 Digitale Plattformen und Portale\n\nFragen Sie mich einfach alles über die UDE!';
      
      suggestions = language === 'en' 
        ? ['Show all buildings', 'Campus hours', 'Contact info', 'Student services']
        : ['Alle Gebäude zeigen', 'Campus-Zeiten', 'Kontakt-Info', 'Studierendenservices'];
    } else {
      // Default response with suggestions
      response = language === 'en' 
        ? 'I can help you with information about UDE campus buildings, services, hours, and more! What would you like to know?'
        : 'Ich kann Ihnen mit Informationen über UDE Campus-Gebäude, Services, Öffnungszeiten und mehr helfen! Was möchten Sie wissen?';
      
      suggestions = language === 'en' 
        ? ['Find buildings', 'Operating hours', 'Contact information', 'Student services', 'Digital portals']
        : ['Gebäude finden', 'Öffnungszeiten', 'Kontaktinformationen', 'Studierendenservices', 'Digitale Portale'];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions,
      quickActions
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const assistantResponse = generateResponse(userMessage.content);
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
      playNotificationSound();
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    // Re-add welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome-new',
        type: 'assistant',
        content: language === 'en' 
          ? 'Chat cleared! How can I help you today?'
          : 'Chat gelöscht! Wie kann ich Ihnen heute helfen?',
        timestamp: new Date(),
        suggestions: language === 'en' 
          ? ['Find buildings', 'Campus hours', 'Contact info']
          : ['Gebäude finden', 'Campus-Zeiten', 'Kontakt-Info']
      };
      setMessages([welcomeMessage]);
    }, 500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Chat button for mobile/desktop
  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed ${
          isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'
        } w-14 h-14 rounded-full shadow-2xl z-50 flex items-center justify-center ${
          isDarkMode 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-all duration-300`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(59, 130, 246, 0.3)',
            '0 0 30px rgba(59, 130, 246, 0.5)',
            '0 0 20px rgba(59, 130, 246, 0.3)'
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        <MessageCircle className="w-6 h-6" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Sparkles className="w-2 h-2 text-white" />
        </motion.div>
      </motion.button>
    );
  }

  // Chat window
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        height: isMinimized ? 'auto' : isMobile ? '80vh' : '600px'
      }}
      className={`fixed ${
        isMobile 
          ? 'bottom-4 right-4 left-4' 
          : 'bottom-6 right-6 w-96'
      } rounded-2xl shadow-2xl z-50 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      } flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              UDE Assistant
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={clearChat}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    
                    <div className={`flex items-center mt-1 space-x-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    {message.quickActions && message.quickActions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.quickActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={action.action}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors w-full ${
                              isDarkMode
                                ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {action.icon}
                            <span>{action.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                              isDarkMode
                                ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'
                  } ${
                    message.type === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'en' ? 'Ask me anything...' : 'Fragen Sie mich alles...'}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  inputValue.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatAssistant;