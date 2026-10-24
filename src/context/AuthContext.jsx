import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'studyai_profile';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updatedUser = { ...(user || {}), ...updates };
    if (!updatedUser.displayName?.trim()) return { user: null, error: new Error('Please enter your name') };
    updatedUser.displayName = updatedUser.displayName.trim();
    updatedUser.uid = updatedUser.uid || 'local-' + Date.now();
    updatedUser.photoURL = updatedUser.photoURL || null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { user: updatedUser, error: null };
  }, [user]);

  const login = useCallback(async (_email, _password, displayName) => updateProfile({ displayName }), [updateProfile]);
  const signup = useCallback(async (_email, _password, displayName) => updateProfile({ displayName }), [updateProfile]);
  const logout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, isDemoMode: true }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
