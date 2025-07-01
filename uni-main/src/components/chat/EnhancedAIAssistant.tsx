import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Sparkles, 
  Mic,
  Volume2,
  Brain,
  Zap,
  Star,
  Minimize2,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { speechService } from '../../services/speechService';
import { ChatNLP } from '../../utils/chatNLP';
import VoiceAssistant from './VoiceAssistant';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'voice' | 'suggestion';
  suggestions?: string[];
  quickActions?: Array<{
    id: string;
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  }>;
}

interface EnhancedAIAssistantProps {
  isDarkMode: boolean;
  onBuildingSelect?: (buildingId: string) => void;
  isMobile?: boolean;
}

const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({ 
  isDarkMode, 
  onBuildingSelect,
  isMobile = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceControls, setShowVoiceControls] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { t, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'en' 
        ? "Hello! 👋 I'm your enhanced UDE Campus Assistant with advanced AI capabilities. I can help you navigate the campus, find buildings, check services, answer questions about university life, and even understand voice commands. How can I assist you today?"
        : "Hallo! 👋 Ich bin Ihr verbesserter UDE Campus-Assistent mit erweiterten KI-Fähigkeiten. Ich kann Ihnen helfen, sich auf dem Campus zurechtzufinden, Gebäude zu finden, Services zu überprüfen, Fragen zum Universitätsleben zu beantworten und sogar Sprachbefehle zu verstehen. Wie kann ich Ihnen heute helfen?",
      isBot: true,
      timestamp: new Date(),
      type: 'text',
      suggestions: language === 'en' 
        ? ['Find the library', 'Show dining options', 'Campus map', 'Voice commands']
        : ['Bibliothek finden', 'Speisemöglichkeiten zeigen', 'Campus-Karte', 'Sprachbefehle']
    }
  ]);

  // Enhanced AI responses with NLP integration
  const generateEnhancedResponse = (userMessage: string): Message => {
    const intent = ChatNLP.extractIntent(userMessage);
    const entities = ChatNLP.extractEntities(userMessage);
    const nlpResponse = ChatNLP.generateContextualResponse(intent, entities, language);

    // Create quick actions for building navigation
    const quickActions = nlpResponse.quickActions.map(action => ({
      id: action.id,
      label: action.label,
      action: () => {
        if (action.buildingId && onBuildingSelect) {
          onBuildingSelect(action.buildingId);
        }
      },
      icon: <Zap className="w-4 h-4" />
    }));

    return {
      id: Date.now().toString(),
      text: nlpResponse.response,
      isBot: true,
      timestamp: new Date(),
      type: 'text',
      suggestions: nlpResponse.suggestions,
      quickActions
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isBot: false,
      timestamp: new Date(),
      type: messageText ? 'voice' : 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Enhanced AI thinking time with more realistic delay
    setTimeout(() => {
      const botResponse = generateEnhancedResponse(textToSend);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Auto-speak response if voice was used and sound is enabled
      if (messageText && soundEnabled && speechService.isSpeechSynthesisSupported()) {
        setTimeout(() => {
          speechService.speak(botResponse.text, language);
        }, 500);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleVoiceInput = (transcript: string) => {
    handleSendMessage(transcript);
  };

  const handleSpeakResponse = (text: string) => {
    if (soundEnabled) {
      speechService.speak(text, language);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome-new',
      text: language === 'en' 
        ? "Chat cleared! How can I help you today?"
        : "Chat gelöscht! Wie kann ich Ihnen heute helfen?",
      isBot: true,
      timestamp: new Date(),
      type: 'text',
      suggestions: language === 'en' 
        ? ['Find buildings', 'Campus hours', 'Contact info']
        : ['Gebäude finden', 'Campus-Zeiten', 'Kontakt-Info']
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update greeting when language changes
  useEffect(() => {
    setMessages(prev => prev.map((msg, index) => 
      index === 0 ? { 
        ...msg, 
        text: language === 'en' 
          ? "Hello! 👋 I'm your enhanced UDE Campus Assistant with advanced AI capabilities. I can help you navigate the campus, find buildings, check services, answer questions about university life, and even understand voice commands. How can I assist you today?"
          : "Hallo! 👋 Ich bin Ihr verbesserter UDE Campus-Assistent mit erweiterten KI-Fähigkeiten. Ich kann Ihnen helfen, sich auf dem Campus zurechtzufinden, Gebäude zu finden, Services zu überprüfen, Fragen zum Universitätsleben zu beantworten und sogar Sprachbefehle zu verstehen. Wie kann ich Ihnen heute helfen?",
        suggestions: language === 'en' 
          ? ['Find the library', 'Show dining options', 'Campus map', 'Voice commands']
          : ['Bibliothek finden', 'Speisemöglichkeiten zeigen', 'Campus-Karte', 'Sprachbefehle']
      } : msg
    ));
  }, [language]);

  // Chat button when closed
  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed ${
          isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'
        } w-16 h-16 rounded-full shadow-2xl z-40 flex items-center justify-center group ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
        } text-white transition-all duration-300`}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(59, 130, 246, 0.5)',
            '0 0 30px rgba(147, 51, 234, 0.5)',
            '0 0 20px rgba(59, 130, 246, 0.5)'
          ]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity },
          default: { duration: 0.2 }
        }}
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-3 h-3 text-white" />
        </motion.div>
      </motion.button>
    );
  }

  // Enhanced Chat Window
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        height: isMinimized ? 'auto' : isMobile ? '85vh' : '600px'
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className={`fixed ${
        isMobile 
          ? 'bottom-4 right-4 left-4' 
          : 'bottom-6 right-6 w-96'
      } rounded-2xl shadow-2xl border ${
        isDarkMode 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-md flex flex-col overflow-hidden z-50`}
    >
      {/* Enhanced Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            animate={{ 
              boxShadow: [
                '0 0 10px rgba(255,255,255,0.3)',
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 10px rgba(255,255,255,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white flex items-center space-x-2">
              <span>Enhanced AI Assistant</span>
              <Sparkles className="w-4 h-4" />
            </h3>
            <p className="text-xs text-white/80">
              {isTyping ? 'AI thinking...' : 'Advanced NLP • Voice Enabled'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            <Volume2 className={`w-4 h-4 text-white ${!soundEnabled ? 'opacity-50' : ''}`} />
          </motion.button>
          <motion.button
            onClick={() => setShowVoiceControls(!showVoiceControls)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Voice Controls"
          >
            <Mic className="w-4 h-4 text-white" />
          </motion.button>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Voice Controls */}
          <AnimatePresence>
            {showVoiceControls && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}
              >
                <VoiceAssistant
                  isDarkMode={isDarkMode}
                  onVoiceInput={handleVoiceInput}
                  onSpeakResponse={handleSpeakResponse}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  message.isBot
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-100'
                      : 'bg-gray-100 text-gray-800'
                    : message.type === 'voice'
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                } shadow-lg`}>
                  <div className="flex items-start space-x-3">
                    {message.isBot && (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      
                      {/* Quick Actions */}
                      {message.quickActions && message.quickActions.length > 0 && (
                        <div className="mt-3 space-y-2">
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
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
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

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        {message.type === 'voice' && (
                          <div className="flex items-center space-x-1">
                            <Mic className="w-3 h-3 opacity-70" />
                            <span className="text-xs opacity-70">Voice</span>
                          </div>
                        )}
                        {message.isBot && (
                          <motion.button
                            onClick={() => handleSpeakResponse(message.text)}
                            className="p-1 rounded opacity-70 hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Read aloud"
                          >
                            <Volume2 className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    {!message.isBot && (
                      <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className={`rounded-2xl p-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                } shadow-lg`}>
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-5 h-5 text-blue-500" />
                    </motion.div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity,
                            delay: i * 0.2 
                          }}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      AI thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'en' ? 'Ask me anything...' : 'Fragen Sie mich alles...'}
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              />
              <motion.button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* AI Status */}
            <div className="flex items-center justify-center mt-2">
              <div className={`flex items-center space-x-2 text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-3 h-3 text-yellow-500" />
                </motion.div>
                <span>Enhanced AI • Voice Enabled • Real-time NLP</span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default EnhancedAIAssistant;