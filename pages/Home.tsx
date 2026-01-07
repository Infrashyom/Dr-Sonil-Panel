
import React, { useState, useEffect } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { FadeInUp, CountUp } from '../components/Animations';
import { ServiceCard } from '../components/ServiceCard';
import { MapSection } from '../components/MapSection';
import { ReasonsSection } from '../components/ReasonsSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Baby, Plus, Minus, Microscope, Award, CheckCircle2, PlayCircle, X } from 'lucide-react';
import { storage } from '../utils/storage';
import { GalleryItem, SiteConfig, Service, FAQ } from '../types';
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from '../utils/youtube';
import { getOptimizedUrl } from '../utils/imageUtils';

const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`mb-4 overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-pink-50/30 border-pink-200 shadow-sm' : 'bg-white border-gray-100 hover:border-pink-100'}`}>
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-base font-bold font-sans transition-colors duration-300 pr-4 ${isOpen ? 'text-pink-700' : 'text-gray-900'}`}>
          {question}
        </span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-pink-600 text-white rotate-180' : 'bg-pink-50 text-pink-600'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed font-light font-sans">
          {answer}
        </div>
      </div>
    </div>
  );
};

// Skeleton Component for Meet Expert Section
const MeetExpertSkeleton = () => (
  <section className="py-24 bg-white relative z-10">
    <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Image Skeleton */}
        <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] bg-gray-100 rounded-[3rem] animate-pulse"></div>
        {/* Text Skeleton */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-[2px] bg-gray-200"></div>
             <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-16 w-3/4 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-4 pt-2">
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [galleryPreview, setGalleryPreview] = useState<GalleryItem[]>([]);
  const [videoPreview, setVideoPreview] = useState<GalleryItem[]>([]);
  const [playingVideo, setPlayingVideo] = useState<GalleryItem | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  
  // Dynamic Content State
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  
  // Independent loading state for critical section
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    // 1. Load Critical Data First (Config)
    const loadConfig = async () => {
      try {
        const conf = await storage.getConfig();
        setConfig(conf);
      } finally {
        setConfigLoading(false);
      }
    };
    loadConfig();

    // 2. Load Secondary Data Independently (Don't block UI)
    const loadSecondaryData = async () => {
      try {
        // Content
        storage.getContent('service').then(data => setServices(data.map(i => i.data)));
        storage.getContent('faq').then(data => setFaqs(data.map(i => i.data)));

        // Gallery
        const items = await storage.getGallery();
        setGalleryPreview(items.filter(item => item.type !== 'video').slice(0, 6));
        
        const allVideos = items.filter(item => item.type === 'video');
        const featuredVideos = allVideos.filter(item => item.featured);
        
        if (featuredVideos.length > 0) {
          setVideoPreview(featuredVideos.slice(0, 3));
        } else if (allVideos.length > 0) {
          setVideoPreview(allVideos.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load secondary home data", error);
      }
    };
    loadSecondaryData();
  }, []);

  const midIndex = Math.ceil(faqs.length / 2);
  const leftColFaqs = faqs.slice(0, midIndex);
  const rightColFaqs = faqs.slice(midIndex);

  const getBentoClass = (index: number) => {
    switch(index) {
      case 3: return "md:col-span-1 md:row-span-2";
      case 4: return "md:col-span-1 md:row-span-2";
      case 5: return "md:col-span-2 md:row-span-2";
      default: return "md:col-span-1 md:row-span-1";
    }
  };

  const doctorImage = config?.doctorImage 
    ? getOptimizedUrl(config.doctorImage, 800) // Optimize doctor image
    : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200";

  return (
    <div className="bg-white overflow-x-hidden font-sans">
      <HeroCarousel />

      {/* Meet The Expert Section */}
      {configLoading ? (
        <MeetExpertSkeleton />
      ) : (
        <section className="py-24 bg-white relative z-10">
          <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Image Side - Fully Enlarged */}
              <div className="w-full lg:w-1/2 relative">
                 <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[700px]">
                    <div className="absolute top-4 right-4 w-full h-full border-2 border-pink-100 rounded-[3rem] z-0 hidden md:block translate-x-4 translate-y-4"></div>
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl z-10 w-full h-full">
                      <img 
                        src={doctorImage} 
                        alt="Dr. Sonil Srivastava" 
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-10 left-10 text-white z-20">
                         <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-90">Experience</p>
                         <p className="text-5xl font-serif font-bold">15+ Years</p>
                      </div>
                    </div>
                    <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-pink-50 max-w-[240px] hidden md:flex">
                       <div className="bg-pink-50 p-3 rounded-xl text-pink-600">
                          <Award size={32} />
                       </div>
                       <div>
                          <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Gold Medalist</p>
                          <p className="font-serif font-bold text-gray-900 text-base leading-tight">Aligarh Muslim Univ.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2">
                <FadeInUp>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-12 h-[2px] bg-pink-600"></span>
                    <span className="text-pink-600 font-bold uppercase tracking-[0.2em] text-sm">Medical Director</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-serif font-bold text-[#590d22] mb-6 leading-none">
                    {config?.doctorName || 'Dr. Sonil'}
                  </h2>
                  <h3 className="text-2xl font-medium text-pink-700 mb-8 italic">
                    {config?.designation || 'Specialist'}
                  </h3>
                  
                  <div className="space-y-6 text-gray-600 leading-relaxed font-light mb-10 text-lg text-justify lg:text-left">
                    <p>
                      With a legacy of excellence in women's healthcare, {config?.doctorName || 'Dr. Sonil'} brings compassion and advanced medical science together. As a Gold Medalist and specialist in high-risk pregnancies, she has successfully handled thousands of complex cases.
                    </p>
                    <p>
                      Her approach is holistic—treating not just the condition but caring for the woman as a whole. From <span className="font-bold text-pink-700">Advanced IVF</span> treatments to precision <span className="font-bold text-pink-700">3D</span> Laparoscopic surgeries, patients trust her for her transparency and high success rates.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                     <div className="flex items-center gap-3"><CheckCircle2 className="text-pink-600 w-6 h-6" /><span className="font-bold text-gray-700">Painless Delivery</span></div>
                     <div className="flex items-center gap-3"><CheckCircle2 className="text-pink-600 w-6 h-6" /><span className="font-bold text-gray-700">Advanced IVF Lab</span></div>
                     <div className="flex items-center gap-3"><CheckCircle2 className="text-pink-600 w-6 h-6" /><span className="font-bold text-gray-700">High-Risk Care</span></div>
                     <div className="flex items-center gap-3"><CheckCircle2 className="text-pink-600 w-6 h-6" /><span className="font-bold text-gray-700"><span className="text-pink-600">3D</span> Laparoscopy</span></div>
                  </div>

                  <div className="flex flex-wrap gap-5">
                    <Link to="/about" className="px-10 py-4 bg-[#590d22] text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[#800f2f] transition-all shadow-lg hover:-translate-y-1">
                      Read Full Profile
                    </Link>
                    <Link to="/contact" className="px-10 py-4 bg-white border border-gray-300 text-gray-900 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-gray-50 transition-all hover:-translate-y-1">
                      Book Appointment
                    </Link>
                  </div>
                </FadeInUp>
              </div>
            </div>
          </div>
        </section>
      )}

      <ReasonsSection />

      {/* Stats Section */}
      <section className="py-20 bg-pink-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-30 translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {[
                { icon: Baby, label: "IVF Babies", value: "5000+" },
                { icon: Users, label: "Happy Patients", value: "15k+" },
                { icon: Star, label: "Success Rate", value: "98%" },
                { icon: Microscope, label: "Experience", value: "20 Yrs" }
              ].map((stat, idx) => {
                 const num = parseInt(stat.value);
                 const suffix = stat.value.replace(/[0-9]/g, '');
                 return (
                  <div key={idx} className="flex flex-col items-center text-center group">
                     <div className="mb-4 bg-white/10 p-4 rounded-2xl text-pink-300 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                       <stat.icon size={32} strokeWidth={1.5} />
                     </div>
                     <h3 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-2">
                        <CountUp end={num} suffix={suffix} duration={2500} />
                     </h3>
                     <p className="text-pink-200 text-xs md:text-sm font-bold uppercase tracking-[0.15em]">{stat.label}</p>
                  </div>
                 );
              })}
           </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-pink-600 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Our Expertise</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#590d22]">Clinical Services</h2>
            </div>
            <Link to="/services" className="inline-flex items-center text-lg font-bold text-gray-900 border-b-2 border-pink-200 hover:border-pink-600 transition-colors pb-1">
              View All Treatments <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.slice(0, 6).map((service, idx) => (
              <FadeInUp key={idx} delay={idx * 50}>
                <ServiceCard service={service} index={idx} />
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />

      {/* Video Gallery */}
      {videoPreview.length > 0 && (
        <section className="py-24 bg-[#590d22] text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
          <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div>
                 <span className="text-pink-300 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Watch Us</span>
                 <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Video Gallery</h2>
               </div>
               <Link to="/gallery" className="inline-flex items-center text-pink-200 hover:text-white transition-colors border-b border-pink-500/30 pb-1">
                 View All Videos <ArrowRight size={16} className="ml-2" />
               </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {videoPreview.map((item, idx) => (
                 <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-video bg-gray-900 cursor-pointer shadow-2xl border border-white/10" onClick={() => setPlayingVideo(item)}>
                    <img src={getYoutubeThumbnail(item.url)} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105 transform" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <PlayCircle className="text-white fill-white/20" size={32} />
                       </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                       <h3 className="text-white font-bold font-serif text-lg line-clamp-1">{item.title}</h3>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Gallery */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
           <div className="text-center mb-16">
              <span className="text-pink-600 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Gallery</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#590d22] mb-4">Life at the Centre</h2>
           </div>
           {galleryPreview.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[250px]">
                {galleryPreview.map((item, idx) => (
                  <div key={idx} className={`group relative rounded-3xl overflow-hidden bg-gray-200 ${getBentoClass(idx)}`}>
                     {/* Optimization: Resize to 500px for thumbnails */}
                     <img 
                      src={getOptimizedUrl(item.url, 500)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      loading="lazy"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex items-end">
                        <span className="text-white font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</span>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center text-gray-400 py-10 italic">No images available</div>
           )}
           <div className="text-center mt-12">
              <Link to="/gallery" className="inline-block border-2 border-[#590d22] text-[#590d22] px-10 py-3 rounded-full font-bold uppercase text-sm hover:bg-[#590d22] hover:text-white transition-all">View Full Gallery</Link>
           </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-serif font-bold text-[#590d22] mb-4">Common Questions</h2>
             <p className="text-gray-500">Everything you need to know about our treatments.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
              <div>{leftColFaqs.map((faq, i) => <FAQItem key={i} {...faq} isOpen={openFaqIndex === i} onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)} />)}</div>
              <div>{rightColFaqs.map((faq, i) => <FAQItem key={i} {...faq} isOpen={openFaqIndex === midIndex + i} onClick={() => setOpenFaqIndex(openFaqIndex === midIndex + i ? null : midIndex + i)} />)}</div>
          </div>
        </div>
      </section>

      <MapSection />

      {/* Global Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setPlayingVideo(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-pink-500 transition-colors p-2 bg-white/10 rounded-full"><X size={24} /></button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
             <iframe 
               src={getYoutubeEmbedUrl(playingVideo.url)} 
               className="w-full h-full" 
               allow="autoplay; encrypted-media" 
               allowFullScreen
               title={playingVideo.title}
             ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};
