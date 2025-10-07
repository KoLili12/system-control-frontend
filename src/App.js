import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage';
import DefectsPage from './pages/DefectsPage/DefectsPage';
import DefectDetailPage from './pages/DefectDetailPage/DefectDetailPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/projects" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProjectDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/defects"
            element={
              <ProtectedRoute>
                <Layout>
                  <DefectsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/defects/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <DefectDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;