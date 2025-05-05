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
          
          setUser(userObject);
        } catch (parseError) {
          console.error("Error parsing stored user data:", parseError);
        }
      }
      
      // Then try API for fresh data if we have a token
      if (localStorage.getItem('token')) {
        try {
          console.log("Auth context: fetching fresh user data");
          const response = await getMe();
          console.log("Auth context: API response", response);
          
          // Extract user from API response
          let freshUserData = null;
          if (response && response.user) {
            freshUserData = response.user;
          } else if (response && response.data && response.data.user) {
            freshUserData = response.data.user;
          } else {
            freshUserData = response;
          }
          
          if (freshUserData) {
            console.log("Auth context: setting fresh user data", freshUserData);
            setUser(freshUserData);
            localStorage.setItem('user', JSON.stringify({ user: freshUserData }));
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          setError("Could not refresh user data");
        }
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
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ user: userData }));
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