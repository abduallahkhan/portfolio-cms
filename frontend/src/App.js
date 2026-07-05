import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import Preview from './pages/Preview';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return isAuth ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/preview/:userId" element={<Preview />} />
          <Route path="/" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="skills" element={<Skills />} />
            <Route path="categories" element={<Categories />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
