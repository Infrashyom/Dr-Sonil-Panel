
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Gallery } from './pages/Gallery';
import { DoctorCard } from './components/DoctorCard';
import { FadeInUp } from './components/Animations';
import { storage } from './utils/storage';
import { NotFound } from './pages/NotFound';
import { Doctor } from './types';
import { ToastProvider } from './components/Toast';

// Admin Pages
import { AdminLogin } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Appointments } from './pages/admin/Appointments';
import { GalleryManager } from './pages/admin/GalleryManager';
import { Settings } from './pages/admin/Settings';
import { ContentManager } from './pages/admin/ContentManager';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// ProtectedRoute Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = storage.isAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Dedicated Doctors Page
const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  useEffect(() => {
     storage.getContent('doctor').then(data => setDoctors(data.map(i => i.data)));
  }, []);

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="bg-pink-900 py-24 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Medical Experts</h1>
          <p className="text-lg text-pink-100 font-light">
              Meet the experienced team dedicated to providing you with world-class healthcare.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {doctors.map((doctor, idx) => (
            <FadeInUp key={idx} delay={idx * 100}>
                <DoctorCard doctor={doctor} />
            </FadeInUp>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* 1. Admin Login (Standalone) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 2. Admin Portal (Protected) */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="gallery" element={<GalleryManager />} />
                <Route path="content" element={<ContentManager />} />
                <Route path="settings" element={<Settings />} />
                {/* Default redirect to dashboard */}
                <Route path="" element={<Navigate to="dashboard" replace />} />
                {/* Catch unknown admin routes */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* 3. Public Website (Layout Wrapper) */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="doctors" element={<DoctorsPage />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                {/* 404 Page Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
