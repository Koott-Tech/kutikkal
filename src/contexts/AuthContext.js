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
        let isTokenExpired = false;
        
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const expirationDate = new Date(payload.exp * 1000);
          const now = new Date();
          isTokenExpired = now > expirationDate;
        }
          
        // If token is expired BUT "Remember Me" is enabled and still valid
        // Keep the user logged in - the API layer will handle token refresh/re-authentication
        // Only clear if "Remember Me" period has also expired (handled by loadAuthData)
        if (isTokenExpired && !storedAuth.remember) {
          // Token expired and "Remember Me" not enabled - clear session storage
            clearAuthData();
            localStorage.setItem('auth_error', 'Your session has expired. Please log in again.');
            setIsLoading(false);
            return;
          }
        
        // If token is expired but "Remember Me" is enabled, keep the data
        // The API layer will handle re-authentication on next request
        // This allows "Remember Me" to work even if JWT expires (user will need to re-login on first API call)
        if (isTokenExpired && storedAuth.remember) {
          console.log('Token expired but "Remember Me" is active - keeping session. User will be prompted to re-login on next API call.');
          // Keep the user data but mark token as expired
          // The API layer will handle prompting for re-login
        }
        
        setToken(storedAuth.token);
        setUser(storedAuth.user);
        setIsRemembered(!!storedAuth.remember);
        
        // Skip Supabase token refresh since we're using backend JWT tokens
        // The backend handles token validation and refresh
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Only clear if it's a parsing error, not just token expiration
        clearAuthData();
      }
    }
    
    setIsLoading(false);
  }, []);

  const refreshTokenIfNeeded = async (supabase, currentToken) => {
    if (!supabase) {
      return;
    }
    
    try {
      // First check if we have an existing session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        return;
      }
      
      if (!sessionData.session) {
        return;
      }
      
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, clear auth data
        logout();
        return;
      }
      
      if (data.session && data.session.access_token !== currentToken) {
        const updatedToken = data.session.access_token;
        const storedUser = user || loadAuthData()?.user || null;
        storeAuthData({ token: updatedToken, user: storedUser, remember: isRemembered });
        setToken(updatedToken);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  const refreshToken = async () => {
    // For backend JWT tokens, we don't need Supabase session refresh
    // The backend API handles token validation and refresh
    
    // Return the current token if available
    const currentToken = getStoredToken();
    if (currentToken) {
      return currentToken;
    }
    
    logout();
    return null;
  };

  // Set the refresh token callback for API requests after refreshToken is defined
  useEffect(() => {
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

