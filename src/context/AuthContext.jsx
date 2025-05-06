import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe } from '../hooks/authApiHook';
import { message } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on component mount
  useEffect(() => {
    loadUser();
  }, []);

  // Load user from localStorage and API
  const loadUser = async () => {
    setLoading(true);
    
    try {
      // First try localStorage for instant UI update
      const userString = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log("Auth context: checking localStorage", { 
        hasUserString: !!userString, 
        hasToken: !!token 
      });
      
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          console.log("Auth context: parsed localStorage user", userData);
          
          // Extract user object from whatever structure we have
          let userObject = null;
          if (userData.user) {
            userObject = userData.user;
          } else if (userData.data && userData.data.user) {
            userObject = userData.data.user;
          } else {
            userObject = userData;
          }
          
          // Validate user object has required fields
          if (userObject && userObject._id) {
            console.log("Auth context: valid user from localStorage", { id: userObject._id });
            setUser(userObject);
          } else {
            console.warn("Auth context: invalid user object in localStorage", userObject);
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
          console.log("Auth context: fetching fresh user data with token", token.substring(0, 10) + '...');
          const response = await getMe();
          console.log("Auth context: API response", response);
          
          // Extract user from API response with detailed validation
          let freshUserData = null;
          
          if (response) {
            if (response.user && response.user._id) {
              freshUserData = response.user;
            } else if (response.data && response.data.user && response.data.user._id) {
              freshUserData = response.data.user;
            } else if (response._id) {
              freshUserData = response;
            } else {
              console.error("Auth context: API response has invalid structure", response);
            }
          }
          
          if (freshUserData && freshUserData._id) {
            console.log("Auth context: setting fresh user data", freshUserData);
            setUser(freshUserData);
            localStorage.setItem('user', JSON.stringify({ user: freshUserData }));
          } else {
            console.warn("Auth context: API returned invalid user data", response);
            // Token might be invalid - clear it if API returned error
            if (response && (response.status === 401 || response.status === 403 || 
                response.message === 'Unauthorized' || response.error === 'Unauthorized')) {
              console.warn("Auth context: Unauthorized response, clearing token");
              localStorage.removeItem('token');
            }
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          setError("Could not refresh user data");
          
          // Check if unauthorized - if so, clear token
          if (apiError.response && 
             (apiError.response.status === 401 || apiError.response.status === 403)) {
            console.warn("Auth context: API returned unauthorized, clearing token");
            localStorage.removeItem('token');
          }
        }
      } else {
        console.log("Auth context: No token found, user remains null");
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Error loading user data");
    } finally {
      setLoading(false);
    }
  };

  // Handle login success
  const loginSuccess = (userData, token) => {
    console.log("Login success function called", { userData, token });
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