import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  MapPin, 
  BookOpen, 
  Calendar,
  Edit3,
  Save,
  Camera,
  Star,
  Award,
  Globe,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { UserProfile } from '../types/User';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode 
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || 'demo-user',
    name: user?.name || 'Demo Student',
    email: user?.email || 'demo@uni-due.de',
    studentId: 'UDE2024001',
    program: 'Computer Science',
    year: 2,
    campus: 'essen',
    interests: ['Technology', 'Research', 'International Exchange'],
    favoriteBuildings: ['library', 'student-center'],
    bio: 'Passionate computer science student interested in AI and machine learning. Love exploring new technologies and connecting with fellow students.',
    isInternational: true,
    language: language,
    notifications: {
      events: true,
      weather: true,
      academic: true,
      social: false
    },
    accessibility: {
      screenReader: false,
      highContrast: false,
      largeText: false
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      setEditedProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
    
    // Load profile photo
    if (user?.id) {
      const savedPhoto = localStorage.getItem(`ude-profile-photo-${user.id}`);
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
    }
  }, [user]);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // In a real app, you would save to the backend here
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

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
        if (user?.id) {
          localStorage.setItem(`ude-profile-photo-${user.id}`, base64String);
        }
        
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

  const getCampusDisplayName = (campus: string) => {
    return campus === 'essen' ? 'Campus Essen' : 'Campus Duisburg';
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
          className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('settings.profile')}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                )}
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
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {getAvatarInitials(profile.name)}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                    {isUploadingPhoto ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </label>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Full Name"
                    />
                    <input
                      type="text"
                      value={editedProfile.studentId || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, studentId: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Student ID"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {profile.name}
                    </h3>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {profile.studentId}
                    </p>
                    {profile.isInternational && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          International Student
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
            }`}>
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Academic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Program</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.program || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, program: e.target.value }))}
                        className={`mt-1 px-2 py-1 rounded border ${
                          isDarkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      />
                    ) : (
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {profile.program}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Year</p>
                    {isEditing ? (
                      <select
                        value={editedProfile.year || 1}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        className={`mt-1 px-2 py-1 rounded border ${
                          isDarkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        {[1, 2, 3, 4, 5, 6].map(year => (
                          <option key={year} value={year}>Year {year}</option>
                        ))}
                      </select>
                    ) : (
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Year {profile.year}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Campus</p>
                    {isEditing ? (
                      <select
                        value={editedProfile.campus || 'essen'}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, campus: e.target.value as 'essen' | 'duisburg' }))}
                        className={`mt-1 px-2 py-1 rounded border ${
                          isDarkMode 
                            ? 'bg-gray-600 border-gray-500 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      >
                        <option value="essen">Campus Essen</option>
                        <option value="duisburg">Campus Duisburg</option>
                      </select>
                    ) : (
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {getCampusDisplayName(profile.campus || 'essen')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                About Me
              </h4>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio || ''}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                  {profile.bio || 'No bio available.'}
                </p>
              )}
            </div>

            {/* Interests */}
            <div>
              <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {(profile.interests || []).map((interest, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode 
                        ? 'bg-blue-600/20 text-blue-400' 
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Favorite Buildings */}
            <div>
              <h4 className={`font-semibold mb-3 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Favorite Buildings</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(profile.favoriteBuildings || []).map((buildingId, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode 
                        ? 'bg-yellow-600/20 text-yellow-400' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {buildingId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className={`font-semibold mb-3 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                <Award className="w-5 h-5 text-purple-500" />
                <span>Achievements</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-purple-600/20' : 'bg-purple-100'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🎓</span>
                    <div>
                      <p className={`font-medium text-sm ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-700'
                      }`}>
                        Campus Explorer
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-purple-300' : 'text-purple-600'
                      }`}>
                        Visited all campus buildings
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-green-600/20' : 'bg-green-100'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌟</span>
                    <div>
                      <p className={`font-medium text-sm ${
                        isDarkMode ? 'text-green-400' : 'text-green-700'
                      }`}>
                        Active Member
                      </p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-green-300' : 'text-green-600'
                      }`}>
                        30 days of activity
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfileModal;