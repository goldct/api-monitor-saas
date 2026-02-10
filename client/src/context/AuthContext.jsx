import { useState, useEffect, createContext, useContext } from 'react';

// Demo auth context (in-memory, no database required)
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check localStorage for demo user
    const savedUser = localStorage.getItem('demo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login: async (email, password) => {
      setLoading(true);
      try {
        // Demo login - accept any email/password
        const demoUser = {
          id: 'demo_user_' + Date.now(),
          email: email,
          full_name: email.split('@')[0],
          plan: 'free',
          created_at: new Date().toISOString()
        };

        setUser(demoUser);
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        return { success: true, data: demoUser };
      } catch (error) {
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    signup: async (email, password, fullName) => {
      setLoading(true);
      try {
        // Demo signup - accept any input
        const demoUser = {
          id: 'demo_user_' + Date.now(),
          email: email,
          full_name: fullName || email.split('@')[0],
          plan: 'free',
          created_at: new Date().toISOString()
        };

        setUser(demoUser);
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        return { success: true, data: demoUser };
      } catch (error) {
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      setLoading(true);
      try {
        setUser(null);
        localStorage.removeItem('demo_user');
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
