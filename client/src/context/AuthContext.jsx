import React, { createContext, useContext, useState, useEffect } from 'react';

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
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
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
