import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_MODE } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoUser, setDemoUser] = useState(null);

  // Demo mode - simulate authentication
  useEffect(() => {
    if (DEMO_MODE) {
      const stored = localStorage.getItem('demo_user');
      if (stored) {
        setDemoUser(JSON.parse(stored));
        setUser(JSON.parse(stored));
      }
      setLoading(false);
    } else {
      // Real Firebase auth would go here
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password, displayName) => {
    if (DEMO_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        uid: 'demo-' + Date.now(),
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('demo_user', JSON.stringify(newUser));
      setDemoUser(newUser);
      setUser(newUser);
      return { user: newUser, error: null };
    }
    // Real Firebase login would go here
    return { user: null, error: new Error('Firebase not configured') };
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        uid: 'demo-' + Date.now(),
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('demo_user', JSON.stringify(newUser));
      setDemoUser(newUser);
      setUser(newUser);
      return { user: newUser, error: null };
    }
    return { user: null, error: new Error('Firebase not configured') };
  }, []);

  const logout = useCallback(async () => {
    if (DEMO_MODE) {
      localStorage.removeItem('demo_user');
      setDemoUser(null);
      setUser(null);
    }
    // Real Firebase logout would go here
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (DEMO_MODE && demoUser) {
      const updatedUser = { ...demoUser, ...updates };
      localStorage.setItem('demo_user', JSON.stringify(updatedUser));
      setDemoUser(updatedUser);
      setUser(updatedUser);
      return { user: updatedUser, error: null };
    }
    return { user: null, error: new Error('Not authenticated') };
  }, [demoUser]);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isDemoMode: DEMO_MODE,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}