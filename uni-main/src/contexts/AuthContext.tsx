import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser, SignUpData } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const { user: currentUser } = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { user: authUser, error } = await authService.signIn(email, password);
      
      if (error) {
        return { success: false, error };
      }

      if (authUser) {
        setUser(authUser);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { user: authUser, error } = await authService.signUp(data);
      
      if (error) {
        return { success: false, error };
      }

      if (authUser) {
        setUser(authUser);
        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};