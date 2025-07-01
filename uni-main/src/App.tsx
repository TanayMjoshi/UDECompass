import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginPage from './components/LoginPage';
import CampusNavigator from './components/CampusNavigator';
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/campus" replace /> : <LoginPage />} 
      />
      <Route 
        path="/campus" 
        element={
          <ProtectedRoute>
            <CampusNavigator />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
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

  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="App">
            <AppContent />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;