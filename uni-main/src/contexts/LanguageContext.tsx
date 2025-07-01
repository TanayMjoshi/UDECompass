import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    'header.title': 'UDE Campus Navigator',
    'header.welcome': 'Welcome',
    'header.logout': 'Logout',
    'header.back': 'Back',
    'login.title': 'UDE Campus Navigator',
    'login.university': 'University of Duisburg-Essen',
    'login.subtitle': 'Your Campus Navigation Guide',
    'login.welcomeBack': 'Welcome Back',
    'login.signInDesc': 'Sign in to access your campus guide',
    'login.createAccount': 'Create Account',
    'login.joinDesc': 'Join the UDE community today',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.signIn': 'Sign In',
    'login.signUp': 'Sign Up',
    'login.noAccount': "Don't have an account?",
    'login.hasAccount': 'Already have an account?',
    'login.demoTitle': 'Demo Credentials',
    'login.demoEmail': 'Email: student@uni-due.de',
    'login.demoPassword': 'Password: password123',
    'login.copyright': '© 2024 University of Duisburg-Essen',
    'building.library': 'Central Library',
    'building.library.category': 'Academic Resources',
    'building.student-center': 'Student Center',
    'building.student-center.category': 'Student Life',
    'building.cafeteria': 'Cafeteria/Mensa',
    'building.cafeteria.category': 'Dining',
    'building.visa-services': 'Visa Services',
    'building.visa-services.category': 'International Support',
    'building.administration': 'Administration',
    'building.administration.category': 'Administrative Services',
    'building.ude-portals': 'UDE Portals',
    'building.ude-portals.category': 'Digital Services',
    'page.availableServices': 'Available Services',
    'page.quickLinks': 'Quick Links',
    'page.campusMaps': 'Campus Maps',
    'search.placeholder': 'Search buildings or services...',
    'search.noResults': 'No results found',
    'sidebar.exploreBuildings': 'Explore Buildings',
    'sidebar.quickAccess': 'Quick Access',
    'updates.title': 'Live Updates',
    'updates.noUpdates': 'No updates available',
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.notifications': 'Notifications',
    'settings.display': 'Display',
    'settings.campus': 'Campus',
    'settings.accessibility': 'Accessibility',
    'settings.privacy': 'Privacy',
    'settings.profile': 'Profile',
    'settings.language': 'Language',
    'settings.enableNotifications': 'Enable Notifications',
    'settings.notificationsDesc': 'Receive updates about campus events and services',
    'settings.soundNotifications': 'Sound Notifications',
    'settings.soundDesc': 'Play sound for new notifications',
    'settings.liveUpdates': 'Live Updates',
    'settings.updatesDesc': 'Real-time campus information and alerts',
    'settings.eventNotifications': 'Event Notifications',
    'settings.eventsDesc': 'Notifications about upcoming campus events',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.auto': 'Auto',
    'settings.fontSize': 'Font Size',
    'settings.small': 'Small',
    'settings.medium': 'Medium',
    'settings.large': 'Large',
    'settings.animations': 'Animations',
    'settings.animationsDesc': 'Enable smooth animations and transitions',
    'settings.compactMode': 'Compact Mode',
    'settings.compactDesc': 'Reduce spacing for more content on screen',
    'settings.showBuildingLabels': 'Show Building Labels',
    'settings.labelsDesc': 'Display building names on the campus map',
    'settings.autoZoom': 'Auto Zoom',
    'settings.zoomDesc': 'Automatically zoom to selected buildings',
    'settings.highContrast': 'High Contrast',
    'settings.contrastDesc': 'Increase contrast for better visibility',
    'settings.reduceMotion': 'Reduce Motion',
    'settings.motionDesc': 'Minimize animations for motion sensitivity',
    'settings.keyboardNav': 'Keyboard Navigation',
    'settings.keyboardDesc': 'Enhanced keyboard navigation support',
    'settings.analytics': 'Analytics',
    'settings.analyticsDesc': 'Help improve the app by sharing usage data',
    'settings.personalizedContent': 'Personalized Content',
    'settings.personalizedDesc': 'Show content based on your preferences',
    'settings.reset': 'Reset to Defaults',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save Changes'
  },
  de: {
    'header.title': 'UDE Campus Navigator',
    'header.welcome': 'Willkommen',
    'header.logout': 'Abmelden',
    'header.back': 'Zurück',
    'login.title': 'UDE Campus Navigator',
    'login.university': 'Universität Duisburg-Essen',
    'login.subtitle': 'Ihr Campus-Navigationsführer',
    'login.welcomeBack': 'Willkommen zurück',
    'login.signInDesc': 'Melden Sie sich an, um auf Ihren Campus-Guide zuzugreifen',
    'login.createAccount': 'Konto erstellen',
    'login.joinDesc': 'Treten Sie noch heute der UDE-Gemeinschaft bei',
    'login.email': 'E-Mail-Adresse',
    'login.password': 'Passwort',
    'login.signIn': 'Anmelden',
    'login.signUp': 'Registrieren',
    'login.noAccount': 'Noch kein Konto?',
    'login.hasAccount': 'Bereits ein Konto?',
    'login.demoTitle': 'Demo-Zugangsdaten',
    'login.demoEmail': 'E-Mail: student@uni-due.de',
    'login.demoPassword': 'Passwort: password123',
    'login.copyright': '© 2024 Universität Duisburg-Essen',
    'building.library': 'Zentralbibliothek',
    'building.library.category': 'Akademische Ressourcen',
    'building.student-center': 'Studierendenzentrum',
    'building.student-center.category': 'Studentenleben',
    'building.cafeteria': 'Cafeteria/Mensa',
    'building.cafeteria.category': 'Gastronomie',
    'building.visa-services': 'Visa-Services',
    'building.visa-services.category': 'Internationale Unterstützung',
    'building.administration': 'Verwaltung',
    'building.administration.category': 'Verwaltungsdienstleistungen',
    'building.ude-portals': 'UDE-Portale',
    'building.ude-portals.category': 'Digitale Dienste',
    'page.availableServices': 'Verfügbare Dienste',
    'page.quickLinks': 'Schnellzugriff',
    'page.campusMaps': 'Campus-Karten',
    'search.placeholder': 'Gebäude oder Dienste suchen...',
    'search.noResults': 'Keine Ergebnisse gefunden',
    'sidebar.exploreBuildings': 'Gebäude erkunden',
    'sidebar.quickAccess': 'Schnellzugriff',
    'updates.title': 'Live-Updates',
    'updates.noUpdates': 'Keine Updates verfügbar',
    'priority.low': 'Niedrig',
    'priority.medium': 'Mittel',
    'priority.high': 'Hoch',
    'settings.title': 'Einstellungen',
    'settings.general': 'Allgemein',
    'settings.notifications': 'Benachrichtigungen',
    'settings.display': 'Anzeige',
    'settings.campus': 'Campus',
    'settings.accessibility': 'Barrierefreiheit',
    'settings.privacy': 'Datenschutz',
    'settings.profile': 'Profil',
    'settings.language': 'Sprache',
    'settings.enableNotifications': 'Benachrichtigungen aktivieren',
    'settings.notificationsDesc': 'Updates über Campus-Events und Services erhalten',
    'settings.soundNotifications': 'Ton-Benachrichtigungen',
    'settings.soundDesc': 'Ton für neue Benachrichtigungen abspielen',
    'settings.liveUpdates': 'Live-Updates',
    'settings.updatesDesc': 'Echtzeit-Campus-Informationen und Warnungen',
    'settings.eventNotifications': 'Event-Benachrichtigungen',
    'settings.eventsDesc': 'Benachrichtigungen über bevorstehende Campus-Events',
    'settings.theme': 'Design',
    'settings.light': 'Hell',
    'settings.dark': 'Dunkel',
    'settings.auto': 'Automatisch',
    'settings.fontSize': 'Schriftgröße',
    'settings.small': 'Klein',
    'settings.medium': 'Mittel',
    'settings.large': 'Groß',
    'settings.animations': 'Animationen',
    'settings.animationsDesc': 'Sanfte Animationen und Übergänge aktivieren',
    'settings.compactMode': 'Kompakter Modus',
    'settings.compactDesc': 'Abstände reduzieren für mehr Inhalt auf dem Bildschirm',
    'settings.showBuildingLabels': 'Gebäude-Labels anzeigen',
    'settings.labelsDesc': 'Gebäudenamen auf der Campus-Karte anzeigen',
    'settings.autoZoom': 'Auto-Zoom',
    'settings.zoomDesc': 'Automatisch zu ausgewählten Gebäuden zoomen',
    'settings.highContrast': 'Hoher Kontrast',
    'settings.contrastDesc': 'Kontrast für bessere Sichtbarkeit erhöhen',
    'settings.reduceMotion': 'Bewegung reduzieren',
    'settings.motionDesc': 'Animationen für Bewegungsempfindlichkeit minimieren',
    'settings.keyboardNav': 'Tastatur-Navigation',
    'settings.keyboardDesc': 'Erweiterte Tastatur-Navigationsunterstützung',
    'settings.analytics': 'Analytik',
    'settings.analyticsDesc': 'Helfen Sie bei der Verbesserung der App durch Teilen von Nutzungsdaten',
    'settings.personalizedContent': 'Personalisierte Inhalte',
    'settings.personalizedDesc': 'Inhalte basierend auf Ihren Präferenzen anzeigen',
    'settings.reset': 'Auf Standard zurücksetzen',
    'settings.cancel': 'Abbrechen',
    'settings.save': 'Änderungen speichern'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ude-language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ude-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};