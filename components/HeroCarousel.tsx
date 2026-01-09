import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../utils/storage';
import { HeroSlide } from '../types';
import { Link } from 'react-router-dom';
import { getOptimizedUrl } from '../utils/imageUtils';
import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react';

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      const data = await storage.getHeroSlides();
      setSlides(data);
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Swipe Logic
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (slides.length === 0) return null;

  return (
    <div 
      className="relative h-[550px] md:h-[85vh] w-full overflow-hidden mt-[60px] md:mt-[65px] group bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Image with Zoom Effect */}
            <div className={`w-full h-full overflow-hidden`}>
              <img 
                src={getOptimizedUrl(slide.image, 1920)} 
                alt={slide.title} 
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                loading={index === 0 ? "eager" : "lazy"} 
              />
            </div>

            {/* Gradient Overlay for Text Readability - Dark Left to Transparent Right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 via-40% to-transparent flex items-center">
              <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 w-full pt-10 md:pt-0">
                <div className={`max-w-xl transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="inline-block px-3 py-1 mb-4 border border-pink-400/30 rounded-full bg-pink-900/30 backdrop-blur-md">
                     <span className="text-pink-300 text-xs font-bold uppercase tracking-widest">Premium Women's Care</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-[1.1] drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 font-light leading-relaxed drop-shadow-md border-l-4 border-pink-600 pl-4 bg-black/10 backdrop-blur-[2px] rounded-r-xl py-1 pr-2">
                    {slide.subtitle}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to="/contact" 
                      className="bg-pink-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-pink-700 transition-all shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:-translate-y-1 flex items-center gap-2"
                    >
                      <CalendarCheck size={18} /> Book Appointment
                    </Link>
                    <Link 
                      to="/services" 
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-pink-900 transition-all"
                    >
                      Explore Services
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows (Desktop) */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-pink-600 transition-colors backdrop-blur-sm hidden md:flex group-hover:opacity-100 opacity-0 duration-300"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-pink-600 transition-colors backdrop-blur-sm hidden md:flex group-hover:opacity-100 opacity-0 duration-300"
      >
        <ChevronRight size={32} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              index === current 
                ? 'w-10 h-3 bg-pink-500' 
                : 'w-3 h-3 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};