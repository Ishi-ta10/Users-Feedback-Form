import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/animations.css';
import Layout from './components/layout/Layout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Feedback pages
import FeedbackListPage from './pages/feedback/FeedbackListPage';
import FeedbackDetailPage from './pages/feedback/FeedbackDetailPage';
import NewFeedbackPage from './pages/feedback/NewFeedbackPage';
import EditFeedbackPage from './pages/feedback/EditFeedbackPage';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// User pages
import ProfilePage from './pages/user/ProfilePage';

// General pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';
// Custom styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes - need authentication */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-feedback" element={<ProfilePage />} />
              <Route path="/feedback" element={<Navigate to="/my-feedback" />} />
              <Route path="/feedback/:id" element={<FeedbackDetailPage />} />
              <Route path="/feedback/new" element={<NewFeedbackPage />} />
              <Route path="/feedback/:id/edit" element={<EditFeedbackPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* 404 page */}
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
  );
}

export default App;
