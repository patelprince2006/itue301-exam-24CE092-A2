import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Customer Authentication State
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('quickbite_customer');
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('quickbite_token') || null;
  });

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    const savedAdmin = localStorage.getItem('quickbite_admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('quickbite_admin_token') || null;
  });

  const [authError, setAuthError] = useState('');
  const [adminError, setAdminError] = useState('');

  // Customer Login function
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

  // Customer Register function
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

  // Customer Logout function
  const logout = () => {
    setCustomer(null);
    setToken(null);
    setAuthError('');
    localStorage.removeItem('quickbite_token');
    localStorage.removeItem('quickbite_customer');
  };

  // Admin Login function (Protected by ID and Password)
  const adminLogin = async (adminId, password) => {
    try {
      setAdminError('');
      const data = await apiFetch('/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, password }),
      });

      if (!data.success) {
        throw new Error(data.message || 'Admin login failed');
      }

      setAdminUser(data.admin);
      setAdminToken(data.token);
      localStorage.setItem('quickbite_admin_token', data.token);
      localStorage.setItem('quickbite_admin', JSON.stringify(data.admin));

      return { success: true, admin: data.admin };
    } catch (err) {
      setAdminError(err.message || 'Admin authentication error');
      return { success: false, message: err.message };
    }
  };

  // Admin Logout function
  const adminLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    setAdminError('');
    localStorage.removeItem('quickbite_admin_token');
    localStorage.removeItem('quickbite_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        // Customer Context
        customer,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        authError,

        // Admin Context
        adminUser,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        adminLogin,
        adminLogout,
        adminError,
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
