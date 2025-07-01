import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  User, 
  Bell, 
  Globe, 
  Palette, 
  Map, 
  Volume2, 
  Eye,
  Clock,
  Smartphone,
  Save,
  RotateCcw,
  Sun,
  Moon,
  Camera,
  Upload
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

interface UserSettings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    email: boolean;
    updates: boolean;
    events: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    animations: boolean;
    compactMode: boolean;
  };
  campus: {
    defaultView: '2d' | '3d';
    showLabels: boolean;
    autoZoom: boolean;
    favoriteBuildings: string[];
  };
  accessibility: {
    highContrast: boolean;
    reduceMotion: boolean;
    screenReader: boolean;
    keyboardNav: boolean;
  };
  privacy: {
    analytics: boolean;
    locationTracking: boolean;
    personalizedContent: boolean;
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    enabled: true,
    sound: true,
    email: false,
    updates: true,
    events: true,
  },
  display: {
    theme: 'light',
    fontSize: 'medium',
    animations: true,
    compactMode: false,
  },
  campus: {
    defaultView: '2d',
    showLabels: true,
    autoZoom: true,
    favoriteBuildings: [],
  },
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNav: false,
  },
  privacy: {
    analytics: true,
    locationTracking: false,
    personalizedContent: true,
  },
};

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ude-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }

    // Load profile photo
    const savedPhoto = localStorage.getItem(`ude-profile-photo-${user?.id}`);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [user?.id]);

  // Update settings and mark as changed
  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  // Update nested settings
  const updateNestedField = (parent: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('ude-settings', JSON.stringify(settings));
    setHasChanges(false);
    
    // Apply theme changes
    if (settings.display.theme === 'dark' && !isDarkMode) {
      onToggleDarkMode();
    } else if (settings.display.theme === 'light' && isDarkMode) {
      onToggleDarkMode();
    }

    // Show success message or close modal
    onClose();
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setProfilePhoto(base64String);
        
        // Save to localStorage (in a real app, this would be saved to the database)
        localStorage.setItem(`ude-profile-photo-${user?.id}`, base64String);
        
        setIsUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setIsUploadingPhoto(false);
      alert('Error uploading photo. Please try again.');
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const tabs = [
    { id: 'general', label: t('settings.general'), icon: <Settings className="w-4 h-4" /> },
    { id: 'notifications', label: t('settings.notifications'), icon: <Bell className="w-4 h-4" /> },
    { id: 'display', label: t('settings.display'), icon: <Palette className="w-4 h-4" /> },
    { id: 'campus', label: t('settings.campus'), icon: <Map className="w-4 h-4" /> },
    { id: 'accessibility', label: t('settings.accessibility'), icon: <Eye className="w-4 h-4" /> },
    { id: 'privacy', label: t('settings.privacy'), icon: <User className="w-4 h-4" /> },
  ];

  const ToggleSwitch: React.FC<{ 
    enabled: boolean; 
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
  }> = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled 
          ? 'bg-blue-600' 
          : isDarkMode 
            ? 'bg-gray-600' 
            : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('settings.profile')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {getAvatarInitials(user?.name || 'User')}
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
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {user?.name || 'Student'}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.email}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {language === 'en' ? 'Click camera icon to upload photo' : 'Klicken Sie auf das Kamera-Symbol, um ein Foto hochzuladen'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('settings.language')}
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    language === 'en'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('de')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    language === 'de'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Deutsch
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.enableNotifications')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.notificationsDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.enabled}
                  onChange={(enabled) => updateSettings('notifications', 'enabled', enabled)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.soundNotifications')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.soundDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.sound}
                  onChange={(enabled) => updateSettings('notifications', 'sound', enabled)}
                  disabled={!settings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.liveUpdates')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.updatesDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.updates}
                  onChange={(enabled) => updateSettings('notifications', 'updates', enabled)}
                  disabled={!settings.notifications.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.eventNotifications')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.eventsDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.events}
                  onChange={(enabled) => updateSettings('notifications', 'events', enabled)}
                  disabled={!settings.notifications.enabled}
                />
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('settings.theme')}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'auto'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateSettings('display', 'theme', theme)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      settings.display.theme === theme
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : isDarkMode
                          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="mb-2">
                        {theme === 'light' && <Sun className="w-6 h-6 mx-auto" />}
                        {theme === 'dark' && <Moon className="w-6 h-6 mx-auto" />}
                        {theme === 'auto' && <Smartphone className="w-6 h-6 mx-auto" />}
                      </div>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {t(`settings.${theme}`)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('settings.fontSize')}
              </h3>
              <div className="flex space-x-3">
                {['small', 'medium', 'large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings('display', 'fontSize', size)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      settings.display.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t(`settings.${size}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.animations')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.animationsDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.display.animations}
                  onChange={(enabled) => updateSettings('display', 'animations', enabled)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.compactMode')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.compactDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.display.compactMode}
                  onChange={(enabled) => updateSettings('display', 'compactMode', enabled)}
                />
              </div>
            </div>
          </div>
        );

      case 'campus':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.showBuildingLabels')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.labelsDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.campus.showLabels}
                  onChange={(enabled) => updateSettings('campus', 'showLabels', enabled)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.autoZoom')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.zoomDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.campus.autoZoom}
                  onChange={(enabled) => updateSettings('campus', 'autoZoom', enabled)}
                />
              </div>
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.highContrast')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.contrastDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.accessibility.highContrast}
                  onChange={(enabled) => updateSettings('accessibility', 'highContrast', enabled)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.reduceMotion')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.motionDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.accessibility.reduceMotion}
                  onChange={(enabled) => updateSettings('accessibility', 'reduceMotion', enabled)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.keyboardNav')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.keyboardDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.accessibility.keyboardNav}
                  onChange={(enabled) => updateSettings('accessibility', 'keyboardNav', enabled)}
                />
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.analytics')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.analyticsDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.privacy.analytics}
                  onChange={(enabled) => updateSettings('privacy', 'analytics', enabled)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('settings.personalizedContent')}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.personalizedDesc')}
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.privacy.personalizedContent}
                  onChange={(enabled) => updateSettings('privacy', 'personalizedContent', enabled)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full ${
            isMobile 
              ? 'max-w-sm h-[90vh] max-h-[90vh]' 
              : 'max-w-4xl max-h-[90vh]'
          } rounded-2xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className={`p-4 md:p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-lg md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('settings.title')}
                </h2>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`flex ${isMobile ? 'flex-col' : ''} flex-1 min-h-0`}>
            {/* Sidebar */}
            <div className={`${
              isMobile ? 'w-full flex-shrink-0' : 'w-64'
            } border-r ${
              isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
            } ${isMobile ? 'p-2' : 'p-4'}`}>
              <nav className={`${isMobile ? 'flex overflow-x-auto space-x-2 scrollbar-hide' : 'space-y-2'}`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      isMobile ? 'flex-shrink-0 px-3 py-2 min-w-max' : 'w-full px-3 py-2'
                    } flex items-center ${
                      isMobile ? 'space-x-1' : 'space-x-3'
                    } rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-500 text-white'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} ${
                      isMobile ? 'whitespace-nowrap' : ''
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className={`flex-1 ${isMobile ? 'p-4' : 'p-6'} overflow-y-auto min-h-0`}>
              {renderTabContent()}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 md:p-6 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } flex items-center justify-between flex-shrink-0`}>
            <button
              onClick={resetSettings}
              className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('settings.reset')}</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {t('settings.cancel')}
              </button>
              <button
                onClick={saveSettings}
                disabled={!hasChanges}
                className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm ${
                  hasChanges
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{t('settings.save')}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;