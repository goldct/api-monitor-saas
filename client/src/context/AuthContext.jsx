import { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  'https://rvxrnipztylzroufvyan.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZCI6InJ4eHVidGxsbiJ2dGUiYW4iZXhzdGxlbWFuIiwicm9sZSI6ImlhdCI6MTc3MDExMTA0MTA0NDgxMywiZXhwIjoxNzAwMTA0MTAyMDg0MzIiLCJwY2I6IjAzZDE1NTAxMTAxNTAwMCI3NzIwMDEwMDEwOTUwMCIsInYwYiI6IjRjNGQ5NTEwMDE1NTgwNHNzInNV1YiI6ImF3ZGRqZWNyT2I1NzAxMDgyNTUzMy40c3hnYzQ1MWUwMDcwNjJkZWIyMjB3MHoxNzAwMTAwMTIwODg0MzIiLCJpZCI6IjAzZDk1NTAxMTAxNTAwMCI3NzIwMDEwMDEwOTUwMCIsInYwYiI6IjRjNGQ1NTEwMDE1NTYwMHNzInNV1YiI6ImF3ZGRqZWNyT2I1NzAxMDgyNTUzMy40c3hnYzQ1MWUwMDcwNjJkZWIyMjB3MHoxNzAwMTAwMTIwODg0MzIiLCJwY2I6IjRjNGQ5NTEwMDE1NTYwMHNzInNV1YiI6ImF3ZGRqZWNyT2I1NzAxMDgyNTUzMy40c3hnYzQ1MWUwMDcwNjJkZWIyMjB3MHoxNzAwMTAwMTIwODg0MzIi'
);

// Auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(userData);
        }
      } catch (error) {
        console.error('Init auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login: async (email, password) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setUser(userData);
        return { success: true, data: userData };
      } catch (error) {
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    signup: async (email, password, fullName) => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setUser(userData);
        return { success: true, data: userData };
      } catch (error) {
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      setLoading(true);
      try {
        await supabase.auth.signOut();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
