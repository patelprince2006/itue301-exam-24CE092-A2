import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import OrderPage from './pages/OrderPage';
import RegisterPage from './pages/RegisterPage';

// Task 2: Lazy load AdminPanel using React.lazy()
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Route: /order */}
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          {/* Lazy Loaded Route: /admin */}
          <Route
            path="/admin"
            element={
              <Suspense
                fallback={
                  <div className="container loading">
                    <div className="zomato-spinner"></div>
                    <p>Loading Admin Dashboard...</p>
                  </div>
                }
              >
                <AdminPanel />
              </Suspense>
            }
          />

          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={
              <div className="container not-found">
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <span className="brand-logo-text">Quick<em>Bite</em></span>
            <p>India's favourite food delivery platform</p>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} QuickBite Food Ordering. ITUE301 Examination.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
