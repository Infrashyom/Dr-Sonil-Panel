
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/storage';
import { Heart, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await storage.login(password);
    
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Access Code');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={32} fill="currentColor" />
        </div>
        
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Doctor Portal</h2>
        <p className="text-gray-500 mb-8">Secure login for Dr. Sonil Women's Care Centre management.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Access Code"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-900 text-white font-bold py-4 rounded-xl hover:bg-pink-800 transition-colors shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};
