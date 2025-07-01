export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  program?: string;
  year?: number;
  campus?: 'duisburg' | 'essen';
  interests?: string[];
  favoriteBuildings?: string[];
  bio?: string;
  isInternational?: boolean;
  language?: 'en' | 'de';
  profilePhoto?: string;
  notifications?: {
    events: boolean;
    weather: boolean;
    academic: boolean;
    social: boolean;
  };
  accessibility?: {
    screenReader: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}