import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseEnabled } from '@/lib/supabase';

export type FWDProfile = {
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
  signUp: (email: string, password: string, displayName: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<FWDProfile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  hasProfile: boolean;
  isSupabaseReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<FWDProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabase();

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('fwd_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.warn('[FWD Auth] fetchProfile error:', error.message);
      }
      return data as FWDProfile | null;
    } catch (e) {
      console.warn('[FWD Auth] fetchProfile exception:', e);
      return null;
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const signUp = async (email: string, password: string, displayName: string, username: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName, username },
        },
      });

      if (authError) return { error: authError };

      // Create profile after signup (if user is confirmed or email confirmation is disabled)
      if (data.user && data.session) {
        const { error: profileError } = await supabase.from('fwd_profiles').insert({
          user_id: data.user.id,
          display_name: displayName,
          username: username.toLowerCase().replace(/\s+/g, ''),
          avatar_url: null,
          bio: null,
          reaction_style: 'default',
          is_public: true,
        });

        if (profileError) {
          console.warn('[FWD Auth] Profile creation error:', profileError.message);
          // Don't fail signup if profile creation fails - can retry later
        } else {
          await refreshProfile();
        }
      }

      return { error: null };
    } catch (e: any) {
      return { error: e };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (e: any) {
      return { error: e };
    }
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

    try {
      const { error } = await supabase
        .from('fwd_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (!error) {
        await refreshProfile();
      }
      return { error };
    } catch (e: any) {
      return { error: e };
    }
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
      updateProfile,
      refreshProfile,
      hasProfile: !!profile,
      isSupabaseReady: isSupabaseEnabled,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
