import { supabase, isDemoMode } from '../lib/supabase';
import { UserProfile } from '../types/User';

// Mock data for demo mode
const mockUserProfile: UserProfile = {
  id: 'demo-user-1',
  name: 'Demo Student',
  email: 'demo@uni-due.de',
  studentId: 'UDE2024001',
  program: 'Computer Science',
  year: 2,
  campus: 'essen',
  interests: ['Technology', 'Research', 'International Exchange'],
  favoriteBuildings: ['library', 'student-center'],
  bio: 'Demo user for UDECompass application.',
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
};

export class SupabaseService {
  // Authentication
  async signUp(email: string, password: string, userData: Partial<UserProfile>) {
    if (isDemoMode) {
      console.log('Demo mode: Simulating user signup');
      return { data: { user: { id: 'demo-user', email } }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (data.user && !error) {
        await this.createUserProfile(data.user.id, {
          ...userData,
          email,
          id: data.user.id
        } as UserProfile);
      }

      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  }

  async signIn(email: string, password: string) {
    if (isDemoMode) {
      console.log('Demo mode: Simulating user signin');
      return { data: { user: { id: 'demo-user', email } }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    }
  }

  async signOut() {
    if (isDemoMode) {
      console.log('Demo mode: Simulating user signout');
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Signout error:', error);
      return { error };
    }
  }

  async getCurrentUser() {
    if (isDemoMode) {
      return { data: { user: { id: 'demo-user', email: 'demo@uni-due.de' } }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    } catch (error) {
      console.error('Get user error:', error);
      return { data: null, error };
    }
  }

  // User Profiles
  async createUserProfile(userId: string, profile: UserProfile) {
    if (isDemoMode) {
      console.log('Demo mode: Simulating profile creation');
      return { data: mockUserProfile, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ ...profile, id: userId }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Create profile error:', error);
      return { data: null, error };
    }
  }

  async getUserProfile(userId: string) {
    if (isDemoMode) {
      console.log('Demo mode: Returning mock user profile');
      return { data: mockUserProfile, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Get profile error:', error);
      return { data: null, error };
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    if (isDemoMode) {
      console.log('Demo mode: Simulating profile update');
      return { data: { ...mockUserProfile, ...updates }, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  }

  // Events
  async getEvents() {
    if (isDemoMode) {
      console.log('Demo mode: Returning mock events');
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Get events error:', error);
      return { data: [], error };
    }
  }

  // Real-time subscriptions
  subscribeToEvents(callback: (payload: any) => void) {
    if (isDemoMode) {
      console.log('Demo mode: Skipping real-time subscription');
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel('events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        callback
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
}

export const supabaseService = new SupabaseService();

// Real-time service for forum and other real-time features
export const RealtimeService = {
  subscribeToEvents(callback: (payload: any) => void) {
    if (isDemoMode) {
      console.log('Demo mode: Skipping real-time subscription');
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel('forum-events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_posts' }, 
        callback
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_comments' }, 
        callback
      )
      .subscribe();

    return channel;
  },

  unsubscribe(channel: any) {
    if (isDemoMode) {
      console.log('Demo mode: Skipping real-time unsubscribe');
      return;
    }

    if (channel) {
      supabase.removeChannel(channel);
    }
  }
};