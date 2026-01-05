
import React, { useEffect, useState } from 'react';
import { FadeInUp, AnimatedBlobs } from '../components/Animations';
import { Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Service } from '../types';
import { IconMapper } from '../components/IconMapper';

export const Services = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    storage.getContent('service').then(data => setServices(data.map(i => i.data)));
  }, []);

  return (
    <div className="bg-white min-h-screen pt-20 overflow-hidden">
      <AnimatedBlobs />
      
      {/* Header */}
      <div className="relative py-24 bg-pink-50/50">
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <FadeInUp>
            <div className="inline-block p-2 px-4 rounded-full bg-white/80 backdrop-blur border border-pink-200 mb-4 shadow-sm">
              <span className="text-pink-600 font-bold uppercase tracking-widest text-xs">World-Class Care</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#590d22] mb-6">Treatments & Surgeries</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              One Stop Solution For Women’s Health in Bhopal. From <span className="font-bold text-pink-700">Advanced IVF</span> to precision <span className="font-bold text-pink-700">3D Laparoscopy</span>.
            </p>
          </FadeInUp>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-20 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <FadeInUp key={idx} delay={idx * 30}>
              <div className="group h-full bg-white rounded-2xl p-8 border border-gray-100 hover:border-pink-200 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col">
                
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Icon */}
                <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300 relative z-10">
                  <IconMapper name={service.icon} size={28} strokeWidth={1.5} />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex-grow">
                   <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors">
                     {service.title}
                   </h3>
                   <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                     {service.description}
                   </p>
                   
                   {/* Mini Details */}
                   <ul className="space-y-2 mb-6">
                      {service.details.slice(0, 2).map((d, i) => (
                        <li key={i} className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wide">
                           <span className="w-1.5 h-1.5 rounded-full bg-pink-300 mr-2"></span>
                           {d}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-[#590d22] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
           <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Need Expert Advice?</h2>
           <p className="text-pink-100 text-lg mb-8 font-light">
             We are available for consultation regarding any gynecological or fertility concerns.
           </p>
           <Link to="/contact" className="inline-flex items-center bg-white text-[#590d22] px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-pink-50 transition-colors shadow-xl">
             Book Your Consultation
           </Link>
        </div>
      </div>
    </div>
  );
};
