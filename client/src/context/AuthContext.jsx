import { useState, useEffect, createContext, useContext } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext(null);

const storageKeys = { user: 'api_monitor_user', token: 'api_monitor_token' };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(storageKeys.user);
    const token = localStorage.getItem(storageKeys.token);
    if (saved && token) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    getToken: () => localStorage.getItem(storageKeys.token),
    login: async (email, password) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) return { success: false, error: data.error || 'Login failed' };

        const u = { id: data.data.user.id, email: data.data.user.email, full_name: data.data.user.full_name, plan: data.data.user.plan || 'free' };
        localStorage.setItem(storageKeys.user, JSON.stringify(u));
        localStorage.setItem(storageKeys.token, data.data.access_token);
        setUser(u);
        return { success: true, data: u };
      } catch (e) {
        return { success: false, error: e.message };
      } finally {
        setLoading(false);
      }
    },
    signup: async (email, password, fullName) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: fullName || email.split('@')[0] }),
        });
        const data = await res.json();
        if (!data.success) return { success: false, error: data.error || 'Signup failed' };

        const u = { id: data.data.id, email: data.data.email, full_name: data.data.full_name, plan: data.data.plan || 'free' };
        if (data.data.access_token) {
          localStorage.setItem(storageKeys.user, JSON.stringify(u));
          localStorage.setItem(storageKeys.token, data.data.access_token);
          setUser(u);
          return { success: true, data: u };
        }
        return { success: true, data: u, needsLogin: true };
      } catch (e) {
        return { success: false, error: e.message };
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      localStorage.removeItem(storageKeys.user);
      localStorage.removeItem(storageKeys.token);
      setUser(null);
    },
    refreshUser: async (userId) => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_BASE}/api/users/${userId}`);
        const data = await res.json();
        if (data.success && data.data) {
          const u = { id: data.data.id, email: data.data.email, full_name: data.data.full_name, plan: data.data.plan || 'free' };
          localStorage.setItem(storageKeys.user, JSON.stringify(u));
          setUser(u);
        }
      } catch (e) {
        console.error('Refresh user error:', e);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};
