
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { SiteConfig } from '../types';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load config
    const loadConfig = async () => {
       const data = await storage.getConfig();
       setConfig(data);
    };
    loadConfig();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ease-in-out border-b py-2 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-gray-100' 
            : 'bg-white border-transparent'
        }`}
      >
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-full">
            
            {/* LEFT: Logo & Branding */}
            <Link to="/" className="flex items-center gap-3 group relative z-50 shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-pink-700 p-1 flex items-center justify-center bg-white shrink-0 transition-transform group-hover:scale-105">
                  <div className="flex flex-col items-center justify-center leading-none text-pink-700">
                    <span className="text-[7px] font-bold uppercase">IVF</span>
                    <Heart size={14} fill="currentColor" className="my-0.5"/>
                    <span className="text-[5px] font-bold uppercase">Center</span>
                  </div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="font-serif font-bold text-lg md:text-xl text-[#590d22] leading-none tracking-tight group-hover:text-pink-700 transition-colors uppercase">
                  {config?.doctorName || 'Dr. Sonil'}
                </h1>
                <div className="hidden md:flex items-center gap-2 mt-0.5 text-[10px] font-bold text-[#c9184a] uppercase tracking-wide opacity-80">
                  <span>{config?.name || 'Women Care Centre'}</span>
                </div>
              </div>
            </Link>

            {/* CENTER: Navigation Tabs */}
            <div className="hidden xl:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-100">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      location.pathname === link.path 
                      ? 'bg-white text-pink-700 shadow-sm border border-gray-100' 
                      : 'text-gray-600 hover:text-pink-600 hover:bg-gray-100/50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
              
            {/* RIGHT: Actions */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
               <Link
                to="/contact"
                className="bg-[#590d22] text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#800f2f] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Book Appointment</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              className="xl:hidden p-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none relative z-50 ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full relative">
          
          {/* Close Button Area */}
          <div className="absolute top-4 right-4 z-50">
             <button 
               onClick={() => setIsOpen(false)}
               className="p-2 bg-gray-100 rounded-full text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
             >
               <X size={24} />
             </button>
          </div>

          <div className="p-8 pt-16 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-[#590d22] mb-1">Menu</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Navigation</p>
          </div>
          
          <div className="p-6 space-y-1 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-colors ${
                   location.pathname === link.path 
                    ? 'bg-pink-50 text-pink-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="p-8 bg-gray-50 border-t border-gray-100">
             <Link
                to="/contact"
                className="w-full bg-[#590d22] text-white py-4 rounded-xl font-bold text-center block shadow-lg mb-6 hover:bg-[#800f2f] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Book Appointment
              </Link>
             <div className="flex justify-center gap-8 text-gray-400">
               {config?.socials?.instagram && <a href={config.socials.instagram} target="_blank" rel="noreferrer"><Instagram size={24} className="hover:text-pink-600 cursor-pointer transition-colors" /></a>}
               {config?.socials?.facebook && <a href={config.socials.facebook} target="_blank" rel="noreferrer"><Facebook size={24} className="hover:text-blue-600 cursor-pointer transition-colors" /></a>}
               {config?.socials?.youtube && <a href={config.socials.youtube} target="_blank" rel="noreferrer"><Youtube size={24} className="hover:text-red-600 cursor-pointer transition-colors" /></a>}
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Footer = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await storage.getConfig();
      setConfig(data);
    };
    loadConfig();
  }, []);

  if (!config) return null;

  const mapLink = config.googleMapLink || (config.googlePlaceId 
    ? `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${config.googlePlaceId}` 
    : "#");

  return (
    <footer className="bg-[#2d0a14] text-white mt-auto font-sans border-t border-white/5 relative z-10">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* 1. Brand & Bio */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <span className="text-xl font-serif font-bold text-white tracking-tight">{config.doctorName}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-pink-500 font-bold">{config.name}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Combining world-class medical expertise with a compassionate touch. Dedicated to the journey of womanhood.
            </p>
          </div>
          
          {/* 2. Quick Links */}
          <div>
            <h4 className="font-bold text-pink-500 mb-4 uppercase text-[10px] tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
                <li><Link to="/" className="hover:text-white transition-colors block hover:translate-x-1 duration-200">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors block hover:translate-x-1 duration-200">About Us</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block hover:translate-x-1 duration-200">Our Services</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors block hover:translate-x-1 duration-200">Medical Team</Link></li>
                <li><Link to="/blogs" className="hover:text-white transition-colors block hover:translate-x-1 duration-200">Health Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors block hover:translate-x-1 duration-200">Book Appointment</Link></li>
            </ul>
          </div>

          {/* 3. Contact Info & Socials */}
          <div>
            <h4 className="font-bold text-pink-500 mb-4 uppercase text-[10px] tracking-widest">Contact & Connect</h4>
            <ul className="space-y-3 text-xs text-gray-400 mb-6">
               <li className="flex items-start gap-3">
                   <div className="mt-0.5 text-pink-500 shrink-0"><MapPin size={14} /></div>
                   <a href={mapLink} target="_blank" rel="noreferrer" className="leading-relaxed text-gray-300 hover:text-white transition-colors border-b border-transparent hover:border-gray-500">{config.address}</a>
               </li>
               <li className="flex items-center gap-3">
                   <div className="text-pink-500 shrink-0"><Phone size={14} /></div>
                   <span className="font-mono text-gray-300">{config.phone}</span>
               </li>
               <li className="flex items-center gap-3">
                   <div className="text-pink-500 shrink-0"><Mail size={14} /></div>
                   <span className="text-gray-300">{config.email}</span>
               </li>
            </ul>
            
            <div className="flex gap-3">
                {config.socials?.instagram && <a href={config.socials.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 hover:text-white transition-all duration-300 text-gray-400"><Instagram size={14} /></a>}
                {config.socials?.facebook && <a href={config.socials.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 text-gray-400"><Facebook size={14} /></a>}
                {config.socials?.youtube && <a href={config.socials.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 text-gray-400"><Youtube size={14} /></a>}
             </div>
          </div>
        </div>

        {/* Bottom Bar: Compact Copyright */}
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                &copy; {new Date().getFullYear()} {config.name}. <span className="mx-2 opacity-30">|</span> Developed by <span className="text-pink-600 font-bold">Infrashyom Nexus Pvt. Ltd.</span>
            </p>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [whatsapp, setWhatsapp] = useState('');
  useEffect(() => {
    storage.getConfig().then(c => setWhatsapp(c.whatsapp || ''));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      
      {/* WhatsApp Float */}
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] transition-all transform hover:scale-110 flex items-center gap-2 group"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      )}
    </div>
  );
};
