import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { AnimatedBlobs } from '../components/Animations';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <AnimatedBlobs />
      
      <div className="relative z-10 bg-white/50 backdrop-blur-sm p-12 rounded-[3rem] border border-white shadow-xl">
        <div className="mb-6 bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-pink-400">
           <Search size={40} />
        </div>
        
        <h1 className="text-8xl font-serif font-bold text-pink-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-widest">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#590d22] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#800f2f] transition-all shadow-lg hover:-translate-y-1"
        >
          <ArrowLeft size={18} /> Return Home
        </Link>
      </div>
    </div>
  );
};