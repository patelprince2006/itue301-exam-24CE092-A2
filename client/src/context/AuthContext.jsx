import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('quickbite_customer');
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('quickbite_token') || null;
  });

  const [authError, setAuthError] = useState('');

  // Login function
  const login = async (email) => {
    try {
      setAuthError('');
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setCustomer(data.customer);
      setToken(data.token);
      localStorage.setItem('quickbite_token', data.token);
      localStorage.setItem('quickbite_customer', JSON.stringify(data.customer));

      return { success: true, customer: data.customer };
    } catch (err) {
      setAuthError(err.message || 'Authentication error');
      return { success: false, message: err.message };
    }
  };

  // Register function
  const register = async ({ name, email, phone, address }) => {
    try {
      setAuthError('');
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      setCustomer(data.customer);
      setToken(data.token);
      localStorage.setItem('quickbite_token', data.token);
      localStorage.setItem('quickbite_customer', JSON.stringify(data.customer));

      return { success: true, customer: data.customer };
    } catch (err) {
      setAuthError(err.message || 'Registration error');
      return { success: false, message: err.message };
    }
  };

  // Logout function
  const logout = () => {
    setCustomer(null);
    setToken(null);
    setAuthError('');
    localStorage.removeItem('quickbite_token');
    localStorage.removeItem('quickbite_customer');
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
