
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Image as ImageIcon, Settings, LogOut, Menu, X, Heart, Globe, FileText, BookOpen } from 'lucide-react';
import { storage } from '../utils/storage';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
    { icon: FileText, label: 'Manage Content', path: '/admin/content' },
    { icon: BookOpen, label: 'Manage Blogs', path: '/admin/blogs' },
    { icon: ImageIcon, label: 'Gallery', path: '/admin/gallery' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
            <Heart className="text-pink-600 fill-current mr-2" size={24} />
            <span className="font-serif font-bold text-gray-900 text-lg">Doctor Portal</span>
            <button className="ml-auto lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-pink-50 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-100">
               <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Globe size={20} />
                View Website
              </Link>
            </div>
          </nav>

          {/* User Info / Logout */}
          <div className="p-4 border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                D
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">Dr. Sonil</p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:hidden shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-gray-900">Doctor Portal</span>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
