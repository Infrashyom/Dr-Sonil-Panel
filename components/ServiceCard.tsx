
import React from 'react';
import { Service } from '../types';
import { IconMapper } from './IconMapper';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  return (
    <div className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col h-full min-h-[320px]">
      {/* Decorative Background Blob */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-pink-50 rounded-full transition-transform group-hover:scale-150 duration-700 ease-in-out"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-16 h-16 bg-white border border-pink-100 rounded-2xl flex items-center justify-center text-pink-600 shadow-lg mb-8 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
          <IconMapper name={service.icon} size={32} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-pink-700 transition-colors">{service.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
          {service.description}
        </p>
        
        {/* List of sub-services */}
        <div className="pt-4 border-t border-gray-50 mt-auto">
            <ul className="space-y-3">
                {service.details.slice(0, 3).map((detail, i) => (
                    <li key={i} className="text-xs font-semibold text-gray-500 flex items-center uppercase tracking-wide">
                        <span className="w-2 h-2 bg-pink-200 rounded-full mr-3"></span>
                        {detail}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};
