import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const registerUser = async (userData) => {
    setError(null);
    try {
      const res = await API.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to register account.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user: loggedUser } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Forgot password - request OTP
  const requestOtp = async (email) => {
    setError(null);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to request password OTP.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Reset password via OTP
  const resetPasswordWithOtp = async (email, otp, newPassword) => {
    setError(null);
    try {
      const res = await API.post('/auth/verify-otp', { email, otp, newPassword });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password. Verify OTP code.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Change password (authenticated settings)
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      const res = await API.post('/auth/change-password', { currentPassword, newPassword });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout user
  const logoutUser = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.warn("Server side logout failed or not supported.");
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      registerUser,
      loginUser,
      logoutUser,
      requestOtp,
      resetPasswordWithOtp,
      changePassword,
      setError
    }}>
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
