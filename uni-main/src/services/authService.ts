import { supabase, isDemoMode } from '../lib/supabase';
import { UserProfile } from '../types/User';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  studentId?: string;
  program?: string;
  year?: number;
  campus?: 'duisburg' | 'essen';
  profilePhoto?: string;
}

class AuthService {
  private users: Map<string, { email: string; password: string; profile: UserProfile }> = new Map();

  constructor() {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('ude-users');
    if (savedUsers) {
      try {
        const usersArray = JSON.parse(savedUsers);
        usersArray.forEach((userData: any) => {
          this.users.set(userData.email, userData);
        });
      } catch (error) {
        console.error('Error loading saved users:', error);
      }
    }

    // Add demo user
    this.users.set('demo@uni-due.de', {
      email: 'demo@uni-due.de',
      password: 'password123',
      profile: {
        id: 'demo-user-1',
        name: 'Demo Student',
        email: 'demo@uni-due.de',
        studentId: 'UDE2024001',
        program: 'Computer Science',
        year: 2,
        campus: 'essen',
        interests: ['Technology', 'Research', 'International Exchange'],
        favoriteBuildings: ['library', 'student-center'],
        bio: 'Demo user for UDE Campus Navigator.',
        isInternational: true,
        language: 'en',
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
      }
    });
  }

  private saveUsers() {
    const usersArray = Array.from(this.users.values());
    localStorage.setItem('ude-users', JSON.stringify(usersArray));
  }

  async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: string | null }> {
    if (isDemoMode) {
      // Check if user already exists
      if (this.users.has(data.email)) {
        return { user: null, error: 'User already exists with this email' };
      }

      // Create new user
      const userId = `user-${Date.now()}`;
      const profile: UserProfile = {
        id: userId,
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        program: data.program,
        year: data.year,
        campus: data.campus || 'essen',
        profilePhoto: data.profilePhoto,
        interests: [],
        favoriteBuildings: [],
        bio: '',
        isInternational: false,
        language: 'en',
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
      };

      this.users.set(data.email, {
        email: data.email,
        password: data.password,
        profile
      });

      this.saveUsers();

      // Save profile photo if provided
      if (data.profilePhoto) {
        localStorage.setItem(`ude-profile-photo-${userId}`, data.profilePhoto);
      }

      return {
        user: {
          id: userId,
          email: data.email,
          name: data.name
        },
        error: null
      };
    }

    // Real Supabase signup
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            student_id: data.studentId,
            program: data.program,
            year: data.year,
            campus: data.campus
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (authData.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            name: data.name,
            email: data.email,
            student_id: data.studentId,
            program: data.program,
            year: data.year,
            campus: data.campus
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        // Save profile photo if provided
        if (data.profilePhoto) {
          const { error: storageError } = await supabase
            .storage
            .from('profile-photos')
            .upload(`${authData.user.id}.jpg`, data.profilePhoto);

          if (storageError) {
            console.error('Profile photo upload error:', storageError);
          }
        }

        return {
          user: {
            id: authData.user.id,
            email: data.email,
            name: data.name
          },
          error: null
        };
      }

      return { user: null, error: 'Failed to create user' };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    if (isDemoMode) {
      const userData = this.users.get(email);
      if (!userData || userData.password !== password) {
        return { user: null, error: 'Invalid email or password' };
      }

      return {
        user: {
          id: userData.profile.id,
          email: userData.email,
          name: userData.profile.name
        },
        error: null
      };
    }

    // Real Supabase signin
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.user.id)
          .single();

        return {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: profile?.name || 'Student'
          },
          error: null
        };
      }

      return { user: null, error: 'Failed to sign in' };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    if (isDemoMode) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  async getCurrentUser(): Promise<{ user: AuthUser | null; error: string | null }> {
    if (isDemoMode) {
      // In demo mode, we don't persist sessions
      return { user: null, error: null };
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.user.id)
          .single();

        return {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: profile?.name || 'Student'
          },
          error: null
        };
      }

      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' };
    }
  }

  async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: string | null }> {
    if (isDemoMode) {
      // Find user by ID in demo mode
      for (const userData of this.users.values()) {
        if (userData.profile.id === userId) {
          return { profile: userData.profile, error: null };
        }
      }
      return { profile: null, error: 'Profile not found' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error: 'An unexpected error occurred' };
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ profile: UserProfile | null; error: string | null }> {
    if (isDemoMode) {
      // Find and update user in demo mode
      for (const [email, userData] of this.users.entries()) {
        if (userData.profile.id === userId) {
          userData.profile = { ...userData.profile, ...updates };
          this.users.set(email, userData);
          this.saveUsers();
          return { profile: userData.profile, error: null };
        }
      }
      return { profile: null, error: 'Profile not found' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error: 'An unexpected error occurred' };
    }
  }
}

export const authService = new AuthService();