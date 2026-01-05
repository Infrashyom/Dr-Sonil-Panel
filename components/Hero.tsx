
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Play } from 'lucide-react';
import { FadeInUp, AnimatedBlobs } from './Animations';

export const Hero = () => {
  return (
    <div className="relative min-h-[95vh] w-full overflow-hidden flex items-center pt-20">
      <AnimatedBlobs />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1 relative">
             {/* Subtle backdrop for better text readability on small screens or overlap */}
            <div className="absolute inset-0 bg-white/30 filter blur-3xl -z-10 rounded-full opacity-0 lg:opacity-100 transform -translate-x-10 scale-125"></div>

            <FadeInUp delay={100}>
               <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-pink-200 rounded-full px-5 py-2 mb-8 shadow-sm">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold tracking-widest text-pink-900 uppercase">#1 IVF & <span className="text-pink-600">3D</span> Laparoscopy Centre</span>
               </div>
            </FadeInUp>

            <FadeInUp delay={300}>
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-pink-950 leading-[1.1] mb-8 font-medium">
                  Motherhood <br/>
                  <span className="italic text-pink-600 font-light relative">
                    Redefined
                    <svg className="absolute w-full h-4 -bottom-1 left-0 text-pink-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
                    </svg>
                  </span>
               </h1>
            </FadeInUp>

            <FadeInUp delay={500}>
              <p className="text-lg md:text-xl text-pink-900/80 mb-10 max-w-lg leading-relaxed font-medium">
                 Experience a blend of medical excellence and holistic wellness. Dr. Sonil Women's Care Centre is where science meets compassion.
              </p>
              
              <div className="flex flex-wrap gap-5">
                 <Link to="/contact" className="group px-8 py-4 bg-pink-900 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-pink-700 transition-all shadow-xl hover:shadow-pink-900/30 flex items-center">
                    Book Visit <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-pink-600 shadow-lg hover:scale-110 transition-transform hover:shadow-xl border border-pink-50">
                    <Play className="ml-1 fill-current" size={20} />
                 </button>
                 <span className="self-center text-sm font-bold text-pink-900 ml-2 hidden sm:inline-block cursor-pointer hover:text-pink-600 transition-colors">Watch Our Story</span>
              </div>
            </FadeInUp>

            <div className="mt-16 flex items-center space-x-8 bg-white/40 backdrop-blur-sm p-6 rounded-2xl w-fit border border-white/50">
                 <div>
                    <h3 className="text-4xl font-serif font-bold text-pink-900">2K+</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-pink-600 font-bold mt-1">IVF Babies</p>
                 </div>
                 <div className="w-px h-12 bg-pink-300/50"></div>
                 <div>
                    <h3 className="text-4xl font-serif font-bold text-pink-900">15+</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-pink-600 font-bold mt-1">Years Exp.</p>
                 </div>
            </div>
          </div>

          {/* Abstract Image Composition */}
          <div className="order-1 lg:order-2 relative h-[500px] md:h-[700px]">
             {/* Main Image */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-t-[10rem] rounded-b-[4rem] overflow-hidden shadow-2xl z-20 border-[8px] border-white/60 animate-float">
                <img src="https://picsum.photos/id/64/800/1000" className="w-full h-full object-cover" alt="Happy Mother" />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 to-transparent"></div>
             </div>
             
             {/* Floating Elements */}
             <div className="absolute top-20 right-0 w-48 h-64 bg-pink-200 rounded-[3rem] overflow-hidden shadow-xl z-10 animate-float animation-delay-2000 hidden md:block border-4 border-white">
                 <img src="https://picsum.photos/id/102/400/600" className="w-full h-full object-cover opacity-90" alt="Baby" />
             </div>
             
             <div className="absolute bottom-10 left-0 w-48 h-auto bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl z-30 p-6 flex flex-col justify-center items-center animate-bounce-slow hidden md:flex border border-pink-100">
                 <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                    <Star className="text-pink-600 fill-current" size={20} />
                 </div>
                 <span className="font-serif font-bold text-pink-900 text-2xl">4.9/5</span>
                 <span className="text-[10px] uppercase tracking-wide text-gray-500 font-bold mt-1">Patient Reviews</span>
             </div>

             {/* Decorative Circles */}
             <div className="absolute top-0 right-10 w-32 h-32 border-4 border-pink-300/50 rounded-full z-0 opacity-50 dashed-circle"></div>
             <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full z-30 shadow-lg opacity-80 animate-pulse"></div>
          </div>

        </div>
      </div>
    </div>
  );
};
