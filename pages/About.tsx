
import React, { useState, useEffect } from 'react';
import { FadeInUp, AnimatedBlobs } from '../components/Animations';
import { ShieldCheck, Heart, UserPlus, Clock, Sparkles } from 'lucide-react';
import { storage } from '../utils/storage';
import { SiteConfig } from '../types';
import { getYoutubeEmbedUrl } from '../utils/youtube';

export const About = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    storage.getConfig().then(setConfig);
  }, []);

  const videoUrl = config?.aboutVideo 
    ? getYoutubeEmbedUrl(config.aboutVideo)
    : "https://www.youtube.com/embed/pL78_6q7eLg?si=generic_medical_video";

  return (
    <div className="pt-20 min-h-screen bg-pink-50/50 overflow-hidden">
      <AnimatedBlobs />

      <div className="bg-pink-900 py-32 text-white relative overflow-hidden rounded-b-[4rem] shadow-2xl mx-4 mt-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeInUp>
            <Sparkles className="mx-auto mb-6 text-pink-300 w-12 h-12" />
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8">Our Legacy</h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto font-light leading-relaxed">
               A center of excellence dedicated to women's health and wellness, combining state-of-the-art technology with compassionate care.
            </p>
          </FadeInUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <FadeInUp>
            <h3 className="text-pink-600 font-bold text-xs uppercase tracking-[0.3em] mb-6">Philosophy</h3>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-pink-950 mb-8 leading-tight">Our Mission & <br/><span className="italic font-light text-pink-700">Vision</span></h2>
            <div className="space-y-6 text-lg text-pink-900/70 font-medium">
              <p className="leading-relaxed">
                {config?.name || "Dr. Sonil Women's Care Centre"} was founded with a singular vision: to provide world-class healthcare to women in Bhopal. We believe that every woman deserves access to the best medical expertise, delivered with empathy and respect.
              </p>
              <p className="leading-relaxed">
                Our collaborative approach, bringing together expert gynecology and cardiology, ensures comprehensive care for mothers, especially those with high-risk pregnancies complicated by heart conditions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              {[
                { icon: Heart, title: "Compassionate Care", text: "Treating patients like family." },
                { icon: ShieldCheck, title: "Advanced Tech", text: "Latest IVF labs & OT equipment." },
                { icon: UserPlus, title: "Expert Team", text: "Gold medalist specialists." },
                { icon: Clock, title: "24/7 Support", text: "Emergency services always open." }
              ].map((item, i) => (
                <div key={i} className="flex items-start p-4 bg-white/60 rounded-xl border border-white shadow-sm">
                  <div className="bg-pink-100 p-2 rounded-lg mr-4 text-pink-600">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-pink-900 font-serif mb-1">{item.title}</h4>
                    <p className="text-xs text-pink-800/70 uppercase tracking-wide font-bold">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
          
          <FadeInUp delay={200}>
            <div className="relative">
               {/* Decorative background blob */}
               <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-[3rem] transform translate-x-6 translate-y-6 opacity-40 blur-sm"></div>
               
               {/* Video Embed */}
               <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white aspect-video bg-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={videoUrl}
                    title="About Dr. Sonil Women's Care Centre" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full object-cover"
                  ></iframe>
               </div>
               
               <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-xl z-20 max-w-xs animate-float animation-delay-2000 hidden md:block">
                  <p className="font-serif text-2xl text-pink-900 font-bold mb-2">Since 2008</p>
                  <p className="text-sm text-gray-500">Dedicated to serving the community with love and science.</p>
               </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
};
