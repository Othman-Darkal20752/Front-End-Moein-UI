/**
 * AuthContext.jsx - Global authentication state management
 * Handles token, user data, and auth status across the app
 */
import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
  clearAllAuthData,
  clearToken,
  getStoredAuth,
  isAuthenticated,
  saveToken,
  getUserData,
  saveUserData,
} from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => isAuthenticated());
  const [user, setUser] = useState(() => getUserData());
  const [loading, setLoading] = useState(false);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const { token } = getStoredAuth();
    setIsAuth(!!token);
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Login: store token and user data
  const login = useCallback((token, userData = null) => {
    saveToken(token);
    if (userData) {
      saveUserData(userData);
      setUser(userData);
    }
    setIsAuth(true);
  }, []);

  // Logout: clear all auth data
  const logout = useCallback(() => {
    clearAllAuthData();
    setIsAuth(false);
    setUser(null);
  }, []);

  // Update user data
  const updateUser = useCallback((userData) => {
    saveUserData(userData);
    setUser(userData);
  }, []);

  // Get current auth (token + type)
  const getAuth = useCallback(() => getStoredAuth(), []);

  const value = {
    isAuth,
    user,
    loading,
    setLoading,
    login,
    logout,
    updateUser,
    getAuth,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
