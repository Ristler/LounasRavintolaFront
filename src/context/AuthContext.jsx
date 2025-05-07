import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { getMe } from '../hooks/authApiHook';
import { message } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add loading ref to prevent duplicate calls
  const loadingRef = useRef(false);
  // Add counter to track API call attempts
  const apiAttemptsRef = useRef(0);

  // Load user on component mount - with dependency array to prevent recreation
  useEffect(() => {
    // Only call loadUser if we haven't already tried multiple times
    if (apiAttemptsRef.current < 3) {
      loadUser();
    }
  }, []);

  // Load user from localStorage and API
  const loadUser = async () => {
    // CRITICAL: Exit if already loading
    if (loadingRef.current) {
      console.log("Auth: Already loading user data, skipping duplicate call");
      return;
    }
    
    // Set loading flags
    loadingRef.current = true;
    setLoading(true);
    
    try {
      // First try localStorage for instant UI update
      const userString = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      let userFromStorage = null;
      
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          
          // Extract user object from whatever structure we have
          if (userData.user) {
            userFromStorage = userData.user;
          } else if (userData.data && userData.data.user) {
            userFromStorage = userData.data.user;
          } else {
            userFromStorage = userData;
          }
          
          // Validate user object has required fields
          if (userFromStorage && userFromStorage._id) {
            setUser(userFromStorage);
          } else {
            console.warn("Auth context: invalid user object in localStorage");
          }
        } catch (parseError) {
          console.error("Error parsing stored user data:", parseError);
          // Clear corrupted data
          localStorage.removeItem('user');
        }
      }
      
      // Then try API for fresh data if we have a token
      if (token) {
        try {
          // Track API attempts
          apiAttemptsRef.current++;
          
          // Only call API if we don't have valid user data or we're below max attempts
          if (!userFromStorage?._id || apiAttemptsRef.current <= 2) {
            console.log(`Auth: Calling API (attempt ${apiAttemptsRef.current})`);
            
            // Set up AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            // Call API with timeout
            const response = await Promise.race([
              getMe(),
              new Promise((_, reject) => setTimeout(() => 
                reject(new Error('API request timeout')), 5000))
            ]);
            
            clearTimeout(timeoutId);
            
            // Extract user from API response with detailed validation
            let freshUserData = null;
            
            if (response) {
              if (response.user && response.user._id) {
                freshUserData = response.user;
              } else if (response.data && response.data.user && response.data.user._id) {
                freshUserData = response.data.user;
              } else if (response._id) {
                freshUserData = response;
              }
            }
            
            if (freshUserData && freshUserData._id) {
              setUser(freshUserData);
              localStorage.setItem('user', JSON.stringify({ user: freshUserData }));
            } else {
              console.warn("Auth: API returned invalid user data");
              // Keep using stored data if available
              if (!userFromStorage) {
                console.warn("Auth: No valid user data available, clearing token");
                localStorage.removeItem('token');
              }
            }
          } else {
            console.log("Auth: Skipping API call, using cached data");
          }
        } catch (apiError) {
          // Don't clear token for network errors
          if (apiError.message === 'API request timeout' || 
              apiError.message === 'Failed to fetch') {
            console.log("Auth: Network error, keeping cached data");
            // Keep using stored data
          } else if (apiError.response?.status === 401 || 
                    apiError.message?.includes('unauthorized')) {
            console.warn("Auth: API returned unauthorized, clearing token");
            localStorage.removeItem('token');
            // Only clear user if we don't have stored data
            if (!userFromStorage) {
              setUser(null);
            }
          }
        }
      } else {
        console.log("Auth: No token found, user remains null");
        setUser(null);
      }
    } catch (err) {
      console.error("Auth: Error loading user:", err.message);
      // Don't update state for unexpected errors if we have user data
      if (!user) {
        setError("Error loading user data");
      }
    } finally {
      setLoading(false);
      // CRITICAL: Reset loading ref with delay
      setTimeout(() => {
        loadingRef.current = false;
      }, 1000);
    }
  };

  // Handle login success
  const loginSuccess = (userData, token) => {
    if (!userData || !token) {
      console.error("Invalid login data", { userData, token });
      message.error("Kirjautuminen epäonnistui: virheellinen vastaus");
      return;
    }
    
    console.log("Login successful", { userData, tokenLength: token.length });
    
    // Store token and user data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ user: userData }));
    
    // Update state
    setUser(userData);
    setError(null);
    
    message.success("Kirjautuminen onnistui!");
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    message.success("Kirjauduit ulos");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      refreshUser: loadUser,
      loginSuccess,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access
export const useAuth = () => useContext(AuthContext);