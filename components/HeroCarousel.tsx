
import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { HeroSlide } from '../types';
import { Link } from 'react-router-dom';
import { getOptimizedUrl } from '../utils/imageUtils';

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    const loadSlides = async () => {
      const data = await storage.getHeroSlides();
      setSlides(data);
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 6000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[600px] md:h-[80vh] w-full overflow-hidden mt-[60px] md:mt-[65px]">
      {slides.map((slide, index) => (
        <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          {/* Optimization: Request 1920px width, auto quality/format */}
          <img 
            src={getOptimizedUrl(slide.image, 1920)} 
            alt={slide.title} 
            className="w-full h-full object-cover" 
            loading={index === 0 ? "eager" : "lazy"} // Eager load the first image only
          />
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="max-w-[95%] mx-auto px-4 w-full">
              <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6">{slide.title}</h1>
              <p className="text-lg md:text-xl text-white mb-8 max-w-lg">{slide.subtitle}</p>
              <Link to="/contact" className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold uppercase">Book Appointment</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
