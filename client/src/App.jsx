import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import OrderPage from './pages/OrderPage';

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
                    <p>Loading Admin Panel...</p>
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
        <div className="container">
          <p>© {new Date().getFullYear()} QuickBite Online Food Ordering System. College Practical Exam.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
