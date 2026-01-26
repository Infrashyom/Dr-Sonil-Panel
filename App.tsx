
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { storage } from './utils/storage';
import { ToastProvider } from './components/Toast';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Gallery = lazy(() => import('./pages/Gallery').then(module => ({ default: module.Gallery })));
const Doctors = lazy(() => import('./pages/Doctors').then(module => ({ default: module.Doctors })));
const Blogs = lazy(() => import('./pages/Blogs').then(module => ({ default: module.Blogs })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Lazy Load Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/Login').then(module => ({ default: module.AdminLogin })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));
const Appointments = lazy(() => import('./pages/admin/Appointments').then(module => ({ default: module.Appointments })));
const GalleryManager = lazy(() => import('./pages/admin/GalleryManager').then(module => ({ default: module.GalleryManager })));
const Settings = lazy(() => import('./pages/admin/Settings').then(module => ({ default: module.Settings })));
const ContentManager = lazy(() => import('./pages/admin/ContentManager').then(module => ({ default: module.ContentManager })));
const BlogManager = lazy(() => import('./pages/admin/BlogManager').then(module => ({ default: module.BlogManager })));


// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-pink-600 animate-spin" strokeWidth={1.5} />
      <p className="text-pink-900 font-serif text-lg animate-pulse tracking-wider">Loading...</p>
    </div>
  </div>
);

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

function App() {
  // Sync Website Config (Title, Favicon)
  useEffect(() => {
    const syncSiteConfig = async () => {
      try {
        const config = await storage.getConfig();
        
        // Update Title
        if (config.name) document.title = config.name;

        // Update Favicon
        if (config.favicon) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = config.favicon;
        }
      } catch (e) {
        console.error("Failed to sync site config", e);
      }
    };
    syncSiteConfig();
  }, []);

  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
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
                  <Route path="blogs" element={<BlogManager />} />
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
                  <Route path="doctors" element={<Doctors />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="blogs" element={<Blogs />} />
                  <Route path="blogs/:id" element={<BlogPost />} />
                  <Route path="contact" element={<Contact />} />
                  {/* 404 Page Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
