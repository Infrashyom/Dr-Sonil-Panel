
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { BlogPost } from '../types';
import { FadeInUp, AnimatedBlobs } from '../components/Animations';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { getOptimizedUrl } from '../utils/imageUtils';

export const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await storage.getBlogs();
      setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
       <AnimatedBlobs />
       
       {/* Hero Section */}
       <div className="bg-pink-50/50 py-24 relative">
          <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 text-center relative z-10">
             <FadeInUp>
               <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#590d22] mb-6">Health & Wellness Blog</h1>
               <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                 Latest insights, tips, and news from Dr. Sonil and the medical team.
               </p>
             </FadeInUp>
          </div>
       </div>

       {/* Blogs Grid */}
       <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-16">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-600" size={40} /></div>
          ) : blogs.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 rounded-3xl">
                <p className="text-gray-500 text-lg">No articles published yet. Check back soon!</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {blogs.map((blog, idx) => (
                   <FadeInUp key={blog.id} delay={idx * 50}>
                      <Link to={`/blogs/${blog.id}`} className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 hover:border-pink-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                         <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                            <img 
                              src={getOptimizedUrl(blog.image, 600)} 
                              alt={blog.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                         </div>
                         <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-4 text-xs font-bold text-pink-600 uppercase tracking-wider mb-4">
                               <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(blog.createdAt).toLocaleDateString()}</span>
                               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                               <span className="flex items-center gap-1"><User size={12}/> {blog.author}</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors line-clamp-2 leading-tight">
                               {blog.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                               {blog.summary}
                            </p>
                            <span className="text-pink-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2 mt-auto group-hover:gap-3 transition-all">
                               Read Article <ArrowRight size={16} />
                            </span>
                         </div>
                      </Link>
                   </FadeInUp>
                ))}
             </div>
          )}
       </div>
    </div>
  );
};
