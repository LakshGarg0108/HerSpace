import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { demoStorage } from '../lib/storage';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isSupabaseConnected: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
  enableDemoUser: (displayName?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
              created_at: session.user.created_at,
            });
          } else {
            // Check if local demo user exists
            const localUser = demoStorage.getUser();
            setUser(localUser);
          }

          // Listen for auth state changes
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
                created_at: session.user.created_at,
              });
            } else {
              setUser(demoStorage.getUser());
            }
          });

          setLoading(false);
          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (e) {
          console.warn('Error reading Supabase session', e);
          setUser(demoStorage.getUser());
          setLoading(false);
        }
      } else {
        // Fallback to local demo user
        const localUser = demoStorage.getUser();
        setUser(localUser);
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          display_name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0],
          created_at: data.user.created_at,
        });
      }
      return { error: null };
    }

    // Demo Mode Sign In
    const demoUser: UserProfile = {
      id: 'demo-user-' + email.replace(/[^a-zA-Z0-9]/g, ''),
      email,
      display_name: email.split('@')[0],
      created_at: new Date().toISOString(),
    };
    demoStorage.setUser(demoUser);
    setUser(demoUser);
    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName?: string): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          display_name: displayName || data.user.email?.split('@')[0],
          created_at: data.user.created_at,
        });
      }
      return { error: null };
    }

    // Demo Mode Sign Up
    const demoUser: UserProfile = {
      id: 'demo-user-' + Date.now(),
      email,
      display_name: displayName || email.split('@')[0],
      created_at: new Date().toISOString(),
    };
    demoStorage.setUser(demoUser);
    setUser(demoUser);
    return { error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    const defaultUser: UserProfile = {
      id: 'demo-user-id',
      email: 'companion@hersafespace.app',
      display_name: 'Friend',
      created_at: new Date().toISOString(),
    };
    demoStorage.setUser(defaultUser);
    setUser(defaultUser);
  };

  const updateDisplayName = async (name: string) => {
    if (!user) return;
    const updated = { ...user, display_name: name };
    setUser(updated);

    if (isSupabaseConfigured && supabase && user.id !== 'demo-user-id') {
      try {
        await supabase.auth.updateUser({
          data: { display_name: name },
        });
      } catch (e) {
        console.warn('Could not sync name to Supabase', e);
      }
    } else {
      demoStorage.setUser(updated);
    }
  };

  const deleteAccount = async (): Promise<{ error: string | null }> => {
    try {
      if (isSupabaseConfigured && supabase && user && user.id !== 'demo-user-id') {
        // In real Supabase, user deletion is handled either via server RPC or admin API
        // Clean up client-side data
        await supabase.from('journal_entries').delete().eq('user_id', user.id);
        await supabase.from('mood_entries').delete().eq('user_id', user.id);
        await supabase.from('chat_conversations').delete().eq('user_id', user.id);
        await supabase.from('personal_reminders').delete().eq('user_id', user.id);
        await supabase.auth.signOut();
      }
      demoStorage.clearAllDemoData();
      setUser(null);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Account cleanup failed' };
    }
  };

  const enableDemoUser = (displayName: string = 'Friend') => {
    const demoUser: UserProfile = {
      id: 'demo-user-id',
      email: 'companion@hersafespace.app',
      display_name: displayName,
      created_at: new Date().toISOString(),
    };
    demoStorage.setUser(demoUser);
    setUser(demoUser);
  };

  const isDemoMode = !isSupabaseConfigured || Boolean(user?.id === 'demo-user-id' || user?.id?.startsWith('demo-user'));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseConnected: isSupabaseConfigured,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        updateDisplayName,
        deleteAccount,
        enableDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
