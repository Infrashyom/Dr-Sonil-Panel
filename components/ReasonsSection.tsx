
import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FadeInUp } from './Animations';
import { storage } from '../utils/storage';
import { SiteConfig } from '../types';

export const ReasonsSection = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    storage.getConfig().then(setConfig);
  }, []);

  const reasons = [
    "Experienced Doctor",
    "Latest IVF Technology",
    "Friendly Staff",
    "Cost Effective",
    "Patient Centric",
    "High Success Rate",
    "Effective Counseling & Support",
    "Expertise in High - Risk Pregnancy"
  ];

  const imageUrl = config?.reasonsImage || "https://images.unsplash.com/photo-1555252333-9f8e92e65df4?q=80&w=1000";

  return (
    <section className="py-12 md:py-24 bg-gradient-to-br from-pink-50/50 to-white">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
        
        {/* MOBILE ONLY HEADER: Center Aligned */}
        <div className="block lg:hidden text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
               Reasons To Consult With <br /> {config?.doctorName || "Dr. Sonil Srivastava"}
            </h2>
             <span className="text-pink-600 font-serif italic text-xl mb-4 relative inline-block">
                First Choice For Childless Couples
                <div className="h-px bg-pink-200 w-full absolute -bottom-1 left-0"></div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-pink-300">❦</div>
             </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Side: Mobile Order 1, Desktop Order 2 (Right) */}
          <div className="flex-1 order-1 lg:order-2 w-full">
            <FadeInUp delay={200}>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src={imageUrl} 
                  alt="Mother and Child" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 to-transparent pointer-events-none"></div>
              </div>
            </FadeInUp>
          </div>

          {/* Text Content: Mobile Order 2, Desktop Order 1 (Left) */}
          <div className="flex-1 order-2 lg:order-1 w-full">
             <FadeInUp>
               {/* DESKTOP ONLY HEADER: Left Aligned, inside the text column */}
               <div className="hidden lg:block text-left mb-8">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">
                    Reasons To Consult With <br /> {config?.doctorName || "Dr. Sonil Srivastava"}
                    </h2>
                    <span className="text-pink-600 font-serif italic text-xl mb-4 relative inline-block">
                        First Choice For Childless Couples
                        <div className="h-px bg-pink-200 w-full absolute -bottom-1 left-0"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-pink-300">❦</div>
                    </span>
               </div>

               <p className="text-gray-600 leading-relaxed font-light text-left mb-8">
                   Are you in search of the Best IVF Doctor near you? Look no further than <strong className="text-pink-700">{config?.doctorName || "Dr. Sonil Srivastava"}</strong>, the Award winning Gynecologist in Bhopal, Central India. She is a highly skilled <strong className="text-pink-700">IVF Specialist</strong> & <strong className="text-pink-700">3D Laparoscopic Surgeon</strong> with an exemplary record of success. Take the first step towards parenthood with {config?.doctorName || "Dr. Sonil"} in Bhopal.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                 {reasons.map((reason, idx) => (
                   <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 md:border-0 justify-start">
                     <CheckCircle2 className="text-pink-600 shrink-0" size={20} fill="#fce7f3" />
                     <span className="font-bold text-gray-800 text-sm md:text-base text-left">{reason}</span>
                   </div>
                 ))}
               </div>
             </FadeInUp>
          </div>

        </div>
      </div>
    </section>
  );
};
