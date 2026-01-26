
import React, { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { Doctor } from '../types';
import { DoctorCard } from '../components/DoctorCard';
import { FadeInUp } from '../components/Animations';

export const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  useEffect(() => {
     storage.getContent('doctor').then(data => setDoctors(data.map(i => i.data)));
  }, []);

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="bg-pink-900 py-24 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Medical Experts</h1>
          <p className="text-lg text-pink-100 font-light">
              Meet the experienced team dedicated to providing you with world-class healthcare.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {doctors.map((doctor, idx) => (
            <FadeInUp key={idx} delay={idx * 100}>
                <DoctorCard doctor={doctor} />
            </FadeInUp>
          ))}
        </div>
      </div>
    </div>
  );
};
