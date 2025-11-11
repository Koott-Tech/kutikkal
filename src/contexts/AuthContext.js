"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { setRefreshTokenCallback } from '../lib/backendApi';
import { getSupabaseClient } from '../lib/supabaseClient';
import {
  clearAuthData,
  getStoredToken,
  loadAuthData,
  storeAuthData,
} from '@/lib/authStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [isRemembered, setIsRemembered] = useState(false);

  useEffect(() => {
    // Get singleton Supabase client
    const supabase = getSupabaseClient();
    setSupabaseClient(supabase);

    // Check for existing token and user data on app load
    const storedAuth = loadAuthData();
    
    if (storedAuth?.token && storedAuth?.user) {
      try {
        // Decode JWT to check expiration
        const tokenParts = storedAuth.token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const expirationDate = new Date(payload.exp * 1000);
          const now = new Date();
          const daysUntilExpiry = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
          
          // Reduced logging for better performance
          if (now > expirationDate) {
            console.log('⚠️ Token expired');
          }
          
          // If token is expired, clear auth and redirect to login
          if (now > expirationDate) {
            console.log('⚠️ Token is expired, clearing auth data');
            clearAuthData();
            localStorage.setItem('auth_error', 'Your session has expired. Please log in again.');
            // Do NOT hard-redirect here to avoid unexpected redirects on public pages/home
            // Let route-level guards handle navigation after auth loads
            setIsLoading(false);
            return;
          }
        }
        
        setToken(storedAuth.token);
        setUser(storedAuth.user);
        setIsRemembered(!!storedAuth.remember);
        
        // Skip Supabase token refresh since we're using backend JWT tokens
        // The backend handles token validation and refresh
        console.log('🔍 Using backend JWT token, skipping Supabase session refresh');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        clearAuthData();
      }
    }
    
    setIsLoading(false);
  }, []);

  const refreshTokenIfNeeded = async (supabase, currentToken) => {
    if (!supabase) {
      console.log('🔍 No Supabase client available for token refresh');
      return;
    }
    
    try {
      console.log('🔍 Attempting token refresh with Supabase client');
      
      // First check if we have an existing session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('🔍 No existing session found, skipping refresh:', sessionError.message);
        return;
      }
      
      if (!sessionData.session) {
        console.log('🔍 No active session found, skipping refresh');
        return;
      }
      
      console.log('🔍 Found existing session, attempting refresh');
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Token refresh failed:', error);
        console.log('🔍 Token refresh error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        // If refresh fails, clear auth data
        logout();
        return;
      }
      
      if (data.session && data.session.access_token !== currentToken) {
        console.log('🔍 Token refreshed successfully');
        const updatedToken = data.session.access_token;
        const storedUser = user || loadAuthData()?.user || null;
        storeAuthData({ token: updatedToken, user: storedUser, remember: isRemembered });
        setToken(updatedToken);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      console.log('🔍 Token refresh exception details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  };

  const refreshToken = async () => {
    // For backend JWT tokens, we don't need Supabase session refresh
    // The backend API handles token validation and refresh
    console.log('🔍 Using backend JWT token system, no Supabase refresh needed');
    
    // Return the current token if available
    const currentToken = getStoredToken();
    if (currentToken) {
      console.log('🔍 Returning current backend JWT token');
      return currentToken;
    }
    
    console.log('🔍 No token available, user needs to login');
    logout();
    return null;
  };

  // Set the refresh token callback for API requests after refreshToken is defined
  useEffect(() => {
    console.log('🔍 Setting refresh token callback in AuthContext');
    setRefreshTokenCallback(refreshToken);
  }, []);

  const login = (userData, authToken, options) => {
    const rememberPreference =
      typeof options === 'boolean'
        ? options
        : options?.remember;
    const finalRemember = rememberPreference ?? isRemembered ?? true;

    setUser(userData);
    setToken(authToken);
    setIsRemembered(!!finalRemember);
    storeAuthData({ token: authToken, user: userData, remember: !!finalRemember });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsRemembered(false);
    clearAuthData();
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
    isRemembered,
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

