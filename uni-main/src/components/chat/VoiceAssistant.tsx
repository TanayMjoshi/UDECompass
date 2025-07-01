import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageSquare,
  Sparkles,
  Waves
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { useLanguage } from '../../contexts/LanguageContext';

interface VoiceAssistantProps {
  isDarkMode: boolean;
  onVoiceInput: (text: string) => void;
  onSpeakResponse: (text: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  isDarkMode, 
  onVoiceInput, 
  onSpeakResponse 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  useEffect(() => {
    setIsSupported(speechService.isSupported());
  }, []);

  const startListening = () => {
    if (!speechService.isSpeechRecognitionSupported()) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    setError('');
    setTranscript('');
    
    speechService.startListening(
      (result) => {
        setTranscript(result);
        setIsListening(false);
        onVoiceInput(result);
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
      },
      language
    );
    
    setIsListening(true);
  };

  const stopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (!speechService.isSpeechSynthesisSupported()) {
      setError('Speech synthesis not supported in this browser');
      return;
    }

    setIsSpeaking(true);
    speechService.speak(text, language);
    
    // Reset speaking state after estimated duration
    const estimatedDuration = text.length * 50; // Rough estimate
    setTimeout(() => setIsSpeaking(false), estimatedDuration);
  };

  const stopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  // Auto-speak responses
  useEffect(() => {
    const handleSpeakResponse = (text: string) => {
      speakText(text);
    };
    
    onSpeakResponse = handleSpeakResponse;
  }, [language]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4">
        {/* Microphone Button */}
        <motion.button
          onClick={isListening ? stopListening : startListening}
          className={`relative p-4 rounded-full shadow-lg transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isListening ? {
            boxShadow: [
              '0 0 20px rgba(239, 68, 68, 0.5)',
              '0 0 40px rgba(239, 68, 68, 0.8)',
              '0 0 20px rgba(239, 68, 68, 0.5)'
            ]
          } : {}}
          transition={{
            boxShadow: { duration: 1, repeat: Infinity }
          }}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
          
          {/* Listening Animation */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-300"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
          )}
        </motion.button>

        {/* Speaker Button */}
        <motion.button
          onClick={isSpeaking ? stopSpeaking : () => {}}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
            isSpeaking
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isSpeaking ? {
            boxShadow: [
              '0 0 20px rgba(34, 197, 94, 0.5)',
              '0 0 40px rgba(34, 197, 94, 0.8)',
              '0 0 20px rgba(34, 197, 94, 0.5)'
            ]
          } : {}}
          transition={{
            boxShadow: { duration: 1, repeat: Infinity }
          }}
        >
          {isSpeaking ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
          
          {/* Speaking Animation */}
          {isSpeaking && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-green-300"
                  animate={{
                    scale: [1, 1.3 + i * 0.2, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </>
          )}
        </motion.button>
      </div>

      {/* Status Display */}
      <AnimatePresence>
        {(isListening || transcript || error) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-white/80'
            } backdrop-blur-sm border ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}
          >
            {isListening && (
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Waves className="w-5 h-5 text-red-500" />
                </motion.div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {language === 'en' ? 'Listening...' : 'Höre zu...'}
                </span>
              </div>
            )}
            
            {transcript && (
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {language === 'en' ? 'You said:' : 'Sie sagten:'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    "{transcript}"
                  </p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <p className={`text-sm font-medium text-red-500`}>
                    {language === 'en' ? 'Error:' : 'Fehler:'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {error}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Commands Help */}
      <motion.div
        className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-gray-700/30' : 'bg-blue-50'
        } border ${
          isDarkMode ? 'border-gray-600' : 'border-blue-200'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {language === 'en' ? 'Voice Commands' : 'Sprachbefehle'}
          </span>
        </div>
        <div className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>• "{language === 'en' ? 'Show me the library' : 'Zeige mir die Bibliothek'}"</p>
          <p>• "{language === 'en' ? 'What events are today?' : 'Welche Veranstaltungen sind heute?'}"</p>
          <p>• "{language === 'en' ? 'How is the weather?' : 'Wie ist das Wetter?'}"</p>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceAssistant;