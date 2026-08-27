import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        college: data.college,
        phone: data.phone,
        profileImage: data.profileImage,
        role: data.role
      }));
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Check if standard object or FormData (if profile image upload)
      let headers = {};
      let body = formData;

      if (formData instanceof FormData) {
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const { data } = await API.post('/auth/register', body, { headers });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        college: data.college,
        phone: data.phone,
        profileImage: data.profileImage,
        role: data.role
      }));
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const seedDemoData = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/seed');
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const headers = { 'Content-Type': 'multipart/form-data' };
      const { data } = await API.put('/users/profile', formData, { headers });
      setUser((prev) => ({ ...prev, ...data }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        seedDemoData,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
