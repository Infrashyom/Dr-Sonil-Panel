
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { storage } from '../utils/storage';
import { SiteConfig } from '../types';

export const MapSection = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    storage.getConfig().then(setConfig);
  }, []);

  if (!config) return null;

  // Construct directions link: use explicit link if available, else fallback to Place ID search, else placeholder
  const directionsUrl = config.googleMapLink || (config.googlePlaceId 
    ? `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${config.googlePlaceId}` 
    : "#");

  return (
    <section className="py-16 bg-white border-t border-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
           <div className="bg-pink-100 p-3 rounded-full text-pink-600">
             <MapPin size={24} />
           </div>
           <div>
             <h2 className="text-3xl font-serif font-bold text-gray-900">Visit Our Centre</h2>
             <p className="text-gray-500">Accessible location in the heart of Arera Colony.</p>
           </div>
           <a 
             href={directionsUrl}
             target="_blank" 
             rel="noreferrer"
             className="md:ml-auto flex items-center gap-2 bg-pink-900 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors shadow-lg"
           >
             <Navigation size={18} />
             <span>Get Directions</span>
           </a>
        </div>

        <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.368339845012!2d77.4332!3d23.2325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDEzJzU3LjAiTiA3N8KwMjUnNTkuNSJF!5e0!3m2!1sen!2sin!4v1635750000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen={true} 
            loading="lazy"
            title="Clinic Location"
            className="filter contrast-100 saturate-100 hover:contrast-100 transition-all duration-500"
          ></iframe>
          
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-xl border border-pink-100 max-w-sm">
             <h4 className="font-serif font-bold text-pink-900 text-lg mb-2">{config.name}</h4>
             <p className="text-sm text-gray-600 mb-1">{config.address}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
