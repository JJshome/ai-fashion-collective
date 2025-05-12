import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Set auth header
        setAuthToken(token);
        
        // Get user data
        const res = await axios.get('/api/users/profile');
        
        setUser(res.data.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setError(err.response?.data?.error || 'An error occurred');
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Register user
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/users/register', formData);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'An error occurred during registration');
      return false;
    }
  };
  
  // Login user
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/users/login', formData);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Invalid credentials');
      return false;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };
  
  // Update profile
  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put('/api/users/profile', formData);
      
      setUser(res.data.data);
      setLoading(false);
      
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to update profile');
      return false;
    }
  };
  
  // Set auth token in header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
