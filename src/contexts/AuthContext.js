"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { setRefreshTokenCallback } from '../lib/backendApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState(null);

  useEffect(() => {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    setSupabaseClient(supabase);

    // Check for existing token and user data on app load
    const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData') || localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Check if token needs refresh
        refreshTokenIfNeeded(supabase, storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const refreshTokenIfNeeded = async (supabase, currentToken) => {
    try {
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, clear auth data
        logout();
        return;
      }
      
      if (data.session && data.session.access_token !== currentToken) {
        console.log('🔍 Token refreshed successfully');
        // Update stored token
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('authToken', data.session.access_token);
        setToken(data.session.access_token);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  const refreshToken = async () => {
    if (!supabaseClient) return null;
    
    try {
      const { data, error } = await supabaseClient.auth.refreshSession();
      
      if (error) {
        console.error('Token refresh failed:', error);
        logout();
        return null;
      }
      
      if (data.session) {
        console.log('🔍 Token refreshed successfully');
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('authToken', data.session.access_token);
        setToken(data.session.access_token);
        return data.session.access_token;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return null;
    }
  };

  // Set the refresh token callback for API requests after refreshToken is defined
  useEffect(() => {
    console.log('🔍 Setting refresh token callback in AuthContext');
    setRefreshTokenCallback(refreshToken);
  }, [supabaseClient]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    refreshToken,
    isAuthenticated,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
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

