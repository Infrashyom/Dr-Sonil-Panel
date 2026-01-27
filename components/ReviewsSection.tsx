
import React, { useState, useEffect } from 'react';
import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { storage } from '../utils/storage';
import { Testimonial, SiteConfig } from '../types';

interface ReviewCardProps {
  review: Testimonial;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => (
  <div className="bg-pink-50/50 p-6 rounded-[2rem] w-[300px] md:w-[400px] shrink-0 flex flex-col h-full border border-pink-100 hover:border-pink-200 transition-colors mx-4">
    <div className="mb-4 text-pink-300">
       <Quote size={24} className="rotate-180 fill-current opacity-50" />
    </div>
    
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
    
    <p className="text-gray-700 text-base leading-relaxed flex-grow font-medium mb-4 line-clamp-4">
      "{review.text}"
    </p>

    <div className="flex items-center gap-4 mt-auto">
       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-pink-900 shadow-sm shrink-0">
         {review.name.charAt(0)}
       </div>
       <div>
         <h3 className="font-bold text-gray-900 font-serif text-sm">{review.name}</h3>
         <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-3 h-3 grayscale opacity-50" />
            <span>Verified Patient</span>
         </div>
       </div>
    </div>
  </div>
);

export const ReviewsSection = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setConfig(await storage.getConfig());
      const reviews = await storage.getContent('testimonial');
      setTestimonials(reviews.map(r => r.data));
    };
    loadData();
  }, []);

  if (testimonials.length === 0) return null;

  // Use the specific review link if placeId is available, otherwise fallback to a search for the clinic
  const rateUrl = config?.googlePlaceId 
    ? `https://search.google.com/local/writereview?placeid=${config.googlePlaceId}`
    : `https://www.google.com/search?q=${encodeURIComponent((config?.name || 'Dr Sonil') + ' reviews')}`;

  const readMoreUrl = config?.googlePlaceId
    ? `https://search.google.com/local/reviews?placeid=${config.googlePlaceId}`
    : `https://www.google.com/search?q=${encodeURIComponent((config?.name || 'Dr Sonil') + ' reviews')}`;

  return (
    <section className="py-12 md:pt-8 md:pb-24 bg-white overflow-hidden">
       {/* Inline Styles for Animation */}
       <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Header: Center on mobile, Left on desktop */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-8 text-center md:text-left">
             <div>
                <span className="text-pink-600 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Testimonials</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#590d22]">Stories of Hope</h2>
             </div>
           
             <div className="flex flex-wrap gap-3 justify-center md:justify-end">
               <a 
                 href={rateUrl}
                 target="_blank"
                 rel="noreferrer" 
                 className="inline-flex items-center gap-2 bg-[#590d22] text-white px-6 py-3 rounded-full font-bold hover:bg-[#800f2f] transition-all shadow-lg hover:shadow-xl text-sm"
               >
                 <MessageSquarePlus size={16} />
                 Rate Us on Google
               </a>

               <a 
                 href={readMoreUrl}
                 target="_blank"
                 rel="noreferrer" 
                 className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors text-sm"
               >
                 <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4" />
                 Read more reviews
               </a>
           </div>
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative w-full overflow-hidden">
         {/* Gradient Masks */}
         <div className="absolute top-0 left-0 h-full w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 h-full w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

         <div className="flex w-max animate-scroll">
            {/* Loop thrice for infinite scroll effect */}
            {testimonials.map((review, i) => <ReviewCard key={`1-${i}`} review={review} />)}
            {testimonials.map((review, i) => <ReviewCard key={`2-${i}`} review={review} />)}
            {testimonials.map((review, i) => <ReviewCard key={`3-${i}`} review={review} />)}
         </div>
      </div>
    </section>
  );
};
