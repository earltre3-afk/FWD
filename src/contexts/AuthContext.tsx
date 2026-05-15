import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseEnabled } from '@/lib/supabase';

type FWDProfile = {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  reaction_style: string | null;
  connected_trey_tv_uid: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: FWDProfile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<FWDProfile>) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<FWDProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabase();

  const fetchProfile = async (userId: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('fwd_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    return data as FWDProfile | null;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    if (!supabase || !isSupabaseEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<FWDProfile>) => {
    if (!supabase || !user) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase
      .from('fwd_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    
    if (!error) {
      await refreshProfile();
    }
    
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
