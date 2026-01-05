
import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../types';
import { Instagram, Stethoscope } from 'lucide-react';

export const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative h-80 sm:h-96 overflow-hidden bg-gray-100">
             <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
            
            {/* Socials */}
            <div className="absolute top-5 right-5 flex flex-col gap-3 translate-x-14 group-hover:translate-x-0 transition-transform duration-300 ease-out">
                 {doctor.socials.instagram && (
                    <a href={doctor.socials.instagram} className="bg-white/95 backdrop-blur p-2.5 rounded-full text-pink-600 hover:bg-pink-600 hover:text-white transition-colors shadow-lg">
                        <Instagram size={18} />
                    </a>
                 )}
            </div>
            
            {/* Badge */}
            <div className="absolute bottom-5 left-5 right-5">
               <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full shadow-lg">
                  <Stethoscope size={14} className="text-pink-600" />
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-900">{doctor.role.split(' ')[0]}</span>
               </div>
            </div>
        </div>
        
        {/* Content */}
        <div className="p-8 flex-grow flex flex-col relative">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">{doctor.name}</h3>
            <p className="text-pink-600 font-semibold text-sm mb-6 uppercase tracking-wide">{doctor.role}</p>
            
            <div className="space-y-4 mb-8 flex-grow">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <p className="text-gray-700 text-sm font-medium leading-relaxed">{doctor.qualifications[0]}</p>
               </div>
               
               <div className="flex flex-wrap gap-2">
                  {doctor.specialties.slice(0, 3).map((spec, i) => (
                    <span key={i} className="px-3 py-1.5 bg-pink-50 text-pink-800 text-xs rounded-lg font-bold border border-pink-100">
                      {spec}
                    </span>
                  ))}
               </div>
            </div>

            <Link to="/contact" className="w-full block text-center bg-gray-900 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-pink-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Book Appointment
            </Link>
        </div>
    </div>
  );
};
