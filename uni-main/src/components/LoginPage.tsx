import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Eye, EyeOff, User, Mail, Lock, Languages, ArrowRight, Sparkles, Moon, Sun, BookOpen, Coffee, Palette, GraduationCap, Calendar, Camera, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState<number>(1);
  const [campus, setCampus] = useState<'duisburg' | 'essen'>('essen');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('ude-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ude-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Reduced file size limit to 2MB to prevent save issues
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setIsUploadingPhoto(true);
    setError('');

    try {
      // Create a smaller image to reduce file size
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Resize image to max 200x200 to reduce file size
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality
        const base64String = canvas.toDataURL('image/jpeg', 0.7);
        setProfilePhoto(base64String);
        setIsUploadingPhoto(false);
      };
      
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setIsUploadingPhoto(false);
      setError('Error uploading photo. Please try again.');
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        
        const { success, error } = await signup({
          email,
          password,
          name: name.trim(),
          studentId: studentId.trim() || undefined,
          program: program.trim() || undefined,
          year,
          campus,
          profilePhoto: profilePhoto || undefined
        });

        if (success) {
          navigate('/campus');
        } else {
          setError(error || 'Signup failed');
        }
      } else {
        const { success, error } = await login(email, password);
        if (success) {
          navigate('/campus');
        } else {
          setError(error || 'Login failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDarkMode(!isDarkMode);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setStudentId('');
    setProgram('');
    setYear(1);
    setCampus('essen');
    setProfilePhoto(null);
    setError('');
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className={`min-h-screen transition-all duration-700 flex items-center justify-center p-4 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`} style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Enhanced Summer University Background */}
      <div className="absolute inset-0 overflow-hidden">
        {isDarkMode ? (
          // Dark mode - Night campus with stars
          <>
            {[...Array(120)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              />
            ))}
            {/* Campus building silhouettes */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800/50 to-transparent" />
          </>
        ) : (
          // Light mode - Summer campus with floating academic elements
          <>
            {/* Floating books */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`book-${i}`}
                className="absolute text-blue-400/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              >
                <BookOpen className="w-8 h-8" />
              </motion.div>
            ))}
            
            {/* Floating coffee cups */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`coffee-${i}`}
                className="absolute text-amber-400/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 4
                }}
              >
                <Coffee className="w-6 h-6" />
              </motion.div>
            ))}

            {/* Art/creativity elements */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`art-${i}`}
                className="absolute text-purple-400/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              >
                <Palette className="w-7 h-7" />
              </motion.div>
            ))}

            {/* Summer sun rays */}
            <div className="absolute top-10 right-10 w-32 h-32">
              <motion.div
                className="w-full h-full bg-gradient-radial from-yellow-300/30 via-orange-200/20 to-transparent rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
              />
            </div>

            {/* Gentle summer breeze effect */}
            <motion.div 
              className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-green-200/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, 20, 0]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            
            <motion.div 
              className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
                y: [0, -15, 0]
              }}
              transition={{ duration: 7, repeat: Infinity }}
            />
            
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-200/15 to-cyan-200/15 rounded-full blur-3xl"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </>
        )}
      </div>

      {/* Top Controls - Fixed positioning to prevent overlap and horizontal scroll */}
      <div className="fixed top-4 left-0 right-0 z-20 pointer-events-none" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ maxWidth: '100%' }}>
          <div className="flex items-center justify-between" style={{ maxWidth: '100%' }}>
            {/* Logo - Left Side */}
            <motion.div
              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg pointer-events-auto flex-shrink-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700' 
                  : 'bg-gradient-to-br from-orange-500 to-amber-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </motion.div>

            {/* Centered Title - Hidden on mobile, shown on desktop */}
            {/* <motion.h1 
              className={`hidden sm:block text-2xl lg:text-3xl font-bold pointer-events-auto text-center flex-1 mx-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('login.title')}
            </motion.h1> */}
            

            {/* Right Controls */}
            <div className="flex items-center space-x-2 pointer-events-auto flex-shrink-0">
              {/* Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                className={`p-2 sm:p-3 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg border transition-all hover:shadow-xl flex items-center justify-center min-h-[44px] min-w-[44px] ${
                  isDarkMode 
                    ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700' 
                    : 'bg-white/90 border-white/20 hover:bg-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={language === 'en' ? 'Switch to German' : 'Auf Englisch wechseln'}
              >
                <div className="flex items-center justify-center">
                  <Languages className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300' 
                      : 'text-gray-600'
                  }`} />
                  <span className={`hidden sm:inline ml-2 text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300' 
                      : 'text-gray-700'
                  }`}>
                    {language.toUpperCase()}
                  </span>
                </div>
              </motion.button>

              {/* Dark Mode Toggle - Fixed alignment */}
              <motion.button
                onClick={toggleDarkMode}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: isDarkMode 
                    ? ['0 0 10px rgba(234, 179, 8, 0.3)', '0 0 20px rgba(234, 179, 8, 0.5)', '0 0 10px rgba(234, 179, 8, 0.3)']
                    : ['0 0 10px rgba(31, 41, 55, 0.3)', '0 0 20px rgba(31, 41, 55, 0.5)', '0 0 10px rgba(31, 41, 55, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        className="relative w-full max-w-md z-10 mt-16 sm:mt-0"
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header - Mobile Title and University Info */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Mobile Title - Only shown on mobile */}
          {/* <motion.h1 
            className={`sm:hidden text-2xl font-bold mb-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('login.title')}
          </motion.h1> */}


          <motion.div
  className="text-center mb-6 flex justify-center items-center"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  {/* Mobile Title - Only shown on mobile */}
  <motion.h1
    className={`sm:hidden text-2xl font-bold mb-4 ${
      isDarkMode
        ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
        : 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
    }`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    {t('login.title')}
  </motion.h1>

  {/* Centered Title - Hidden on mobile, shown on desktop */}
  <motion.h1
    className={`hidden sm:block text-2xl lg:text-3xl font-bold text-center ${
      isDarkMode
        ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
        : 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
    }`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    {t('login.title')}
  </motion.h1>
</motion.div>


          <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('login.university')}
          </p>
          <p className={`text-sm mt-1 flex items-center justify-center space-x-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Sparkles className="w-4 h-4" />
            <span>{t('login.subtitle')}</span>
          </p>
        </motion.div>

        {/* Login Form - Enhanced */}
        <motion.div 
          className={`backdrop-blur-md shadow-2xl rounded-2xl p-6 border ${
            isDarkMode 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/90 border-white/20'
          }`}
          style={{ maxWidth: '100%', overflowX: 'hidden' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {isSignUp ? t('login.createAccount') : t('login.welcomeBack')}
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isSignUp ? t('login.joinDesc') : t('login.signInDesc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field - Only for signup */}
            {isSignUp && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-500 group-focus-within:text-blue-400' 
                        : 'text-gray-400 group-focus-within:text-orange-500'
                    }`} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700/80 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-white/80 border-gray-300 text-gray-800 focus:ring-orange-500 focus:border-orange-500'
                    }`}
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}

            {/* Profile Photo Upload - Only for signup */}
            {isSignUp && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {name ? getAvatarInitials(name) : <User className="w-8 h-8" />}
                      </div>
                    )}
                    
                    {/* Upload button overlay */}
                    <label className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                      {isUploadingPhoto ? (
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-3 h-3" />
                      )}
                    </label>
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {language === 'en' ? 'Upload a profile photo' : 'Profilbild hochladen'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {language === 'en' ? 'Max 2MB, JPG/PNG' : 'Max 2MB, JPG/PNG'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Email Field - Enhanced */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('login.email')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${
                    isDarkMode 
                      ? 'text-gray-500 group-focus-within:text-blue-400' 
                      : 'text-gray-400 group-focus-within:text-orange-500'
                  }`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700/80 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'bg-white/80 border-gray-300 text-gray-800 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  placeholder="student@uni-due.de"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field - Enhanced */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('login.password')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${
                    isDarkMode 
                      ? 'text-gray-500 group-focus-within:text-blue-400' 
                      : 'text-gray-400 group-focus-within:text-orange-500'
                  }`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700/80 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'bg-white/80 border-gray-300 text-gray-800 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                  placeholder={language === 'en' ? 'Enter your password' : 'Passwort eingeben'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center rounded-r-xl transition-colors ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Additional Signup Fields */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Student ID */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700/80 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                        : 'bg-white/80 border-gray-300 text-gray-800 focus:ring-orange-500 focus:border-orange-500'
                    }`}
                    placeholder="UDE2024001"
                  />
                </div>

                {/* Program and Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Program
                    </label>
                    <div className="relative">
                      <GraduationCap className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        className={`block w-full pl-9 pr-3 py-2 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-gray-700/80 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                            : 'bg-white/80 border-gray-300 text-gray-800 focus:ring-orange-500 focus:border-orange-500'
                        }`}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className={`block w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700/80 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-white/80 border-gray-300 text-gray-800 focus:ring-orange-500 focus:border-orange-500'
                      }`}
                    >
                      {[1, 2, 3, 4, 5, 6].map(y => (
                        <option key={y} value={y}>Year {y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Campus Selection */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Campus
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCampus('essen')}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        campus === 'essen'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                            ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-600'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <MapPin className="w-5 h-5 mx-auto mb-1" />
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          Essen
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampus('duisburg')}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        campus === 'duisburg'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isDarkMode
                            ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-600'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <MapPin className="w-5 h-5 mx-auto mb-1" />
                        <p className={`text-sm font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          Duisburg
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message - Enhanced */}
            {error && (
              <motion.div 
                className={`border rounded-xl p-3 ${
                  isDarkMode 
                    ? 'bg-red-900/50 border-red-700' 
                    : 'bg-red-50 border-red-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className={`text-sm text-center ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button - Enhanced */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 focus:ring-orange-500'
              }`}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span>{isSignUp ? t('login.signUp') : t('login.signIn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle Sign Up/Sign In - Enhanced */}
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isSignUp ? t('login.hasAccount') : t('login.noAccount')}
              <button
                onClick={handleModeSwitch}
                className={`ml-2 font-medium transition-colors hover:underline ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-orange-600 hover:text-orange-700'
                }`}
              >
                {isSignUp ? t('login.signIn') : t('login.signUp')}
              </button>
            </p>
          </motion.div>

          {/* Demo Credentials - Enhanced */}
          {!isSignUp && (
            <motion.div 
              className={`mt-4 p-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-700' 
                  : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <p className={`text-xs text-center font-medium mb-2 flex items-center justify-center space-x-1 ${
                isDarkMode ? 'text-blue-300' : 'text-orange-700'
              }`}>
                <Sparkles className="w-3 h-3" />
                <span>{t('login.demoTitle')}</span>
              </p>
              <div className={`text-xs text-center space-y-1 ${
                isDarkMode ? 'text-blue-400' : 'text-orange-600'
              }`}>
                <p>{t('login.demoEmail')}</p>
                <p>{t('login.demoPassword')}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer - Enhanced */}
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.copyright')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;