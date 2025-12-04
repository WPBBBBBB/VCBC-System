import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import HomePage from './pages/HomePage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import CertificateDetailsPage from './pages/CertificateDetailsPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import VerificationHistoryPage from './pages/VerificationHistoryPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Dashboard Components
import { DashboardLayout } from './Dashboard/components/DashboardLayout';
import { AdminProtectedRoute } from './Dashboard/components/AdminProtectedRoute';
import { Dashboard as AdminDashboard } from './Dashboard/pages/Dashboard';
import { IssueCertificate } from './Dashboard/pages/IssueCertificate';
import { IssuedCertificates } from './Dashboard/pages/IssuedCertificates';
import { Managers } from './Dashboard/pages/Managers';
import { VerificationHistory as AdminVerificationHistory } from './Dashboard/pages/VerificationHistory';

import './styles/global.css';
import './App.css';

// Main App Component with Routing and Theme/Language Support
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AdminProvider>
            <Router>
              <Routes>
                {/* Public Routes with Header/Footer */}
                <Route
                  path="/*"
                  element={
                    <div className="app-layout">
                      <Header />
                      <main className="app-main">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/verify" element={<VerifyCertificatePage />} />
                          <Route path="/details" element={<CertificateDetailsPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                          <Route path="/account" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                          <Route path="/verification-history" element={<ProtectedRoute><VerificationHistoryPage /></ProtectedRoute>} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  }
                />

                {/* Admin Dashboard Routes (No Header/Footer) */}
                <Route
                  path="/dashboard/*"
                  element={
                    <AdminProtectedRoute>
                      <DashboardLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard/home" replace />} />
                  <Route path="home" element={<AdminDashboard />} />
                  <Route path="issue" element={<IssueCertificate />} />
                  <Route path="issued" element={<IssuedCertificates />} />
                  <Route path="managers" element={<Managers />} />
                  <Route path="history" element={<AdminVerificationHistory />} />
                </Route>
              </Routes>
            </Router>
          </AdminProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
