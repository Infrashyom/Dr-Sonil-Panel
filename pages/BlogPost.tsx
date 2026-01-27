
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { BlogPost as BlogPostType } from '../types';
import { ArrowLeft, Calendar, User, Share2, Loader2 } from 'lucide-react';
import { getOptimizedUrl } from '../utils/imageUtils';

export const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (id) {
        const data = await storage.getBlogById(id);
        setBlog(data);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 className="animate-spin text-pink-600" size={40} /></div>;
  }

  if (!blog) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-4">
           <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Article Not Found</h1>
           <Link to="/blogs" className="text-pink-600 hover:underline flex items-center gap-2 font-bold"><ArrowLeft size={16}/> Back to Blogs</Link>
        </div>
     );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, text: blog.summary, url: window.location.href });
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-24">
       <div className="max-w-[95%] 2xl:max-w-[1400px] mx-auto px-4 sm:px-6">
          
          {/* Navigation */}
          <div className="mb-8 max-w-4xl mx-auto">
             <Link to="/blogs" className="inline-flex items-center text-pink-600 hover:text-pink-800 font-bold uppercase tracking-widest text-xs transition-colors">
                <ArrowLeft size={16} className="mr-2"/> Back to Articles
             </Link>
          </div>

          {/* Hero Image - Uncropped & Separated */}
          {/* Using a aspect ratio that allows the image to shine without being too tall */}
          <div className="w-full aspect-video md:aspect-[21/9] max-h-[600px] bg-gray-100 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl mb-12 border border-gray-100">
             <img 
               src={getOptimizedUrl(blog.image, 1920)} 
               alt={blog.title} 
               className="w-full h-full object-cover" 
             />
          </div>

          {/* Header & Meta */}
          <div className="max-w-4xl mx-auto mb-12">
             <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-bold text-pink-600 uppercase tracking-wider mb-6">
                <span className="flex items-center gap-2"><Calendar size={16}/> {new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="w-1.5 h-1.5 bg-pink-200 rounded-full"></span>
                <span className="flex items-center gap-2"><User size={16}/> {blog.author}</span>
             </div>
             
             <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.1] mb-8">
                {blog.title}
             </h1>

             <button onClick={handleShare} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-pink-700 rounded-full font-bold text-sm transition-all">
                <Share2 size={18}/> Share Article
             </button>
          </div>

          {/* Content Body */}
          <div className="max-w-4xl mx-auto">
             <div className="prose prose-lg md:prose-xl prose-pink prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed mx-auto">
                <p className="lead text-xl md:text-2xl text-gray-600 font-light italic border-l-4 border-pink-500 pl-6 mb-12">
                   {blog.summary}
                </p>
                
                <style>{`
                   .blog-content a { color: #db2777; text-decoration: underline; font-weight: 500; transition: color 0.2s; }
                   .blog-content a:hover { color: #9d174d; }
                   .blog-content h2 { margin-top: 2em; margin-bottom: 0.5em; font-weight: 800; color: #1f2937; line-height: 1.3; font-size: 1.5em; }
                   .blog-content h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700; color: #374151; font-size: 1.25em; }
                   .blog-content p { margin-bottom: 1.2em; color: #374151; }
                   .blog-content img { border-radius: 1.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); margin: 3rem 0; width: 100%; }
                   .blog-content ul { padding-left: 1.5em; list-style-type: disc; margin-bottom: 1.5em; }
                   .blog-content ol { padding-left: 1.5em; list-style-type: decimal; margin-bottom: 1.5em; }
                   .blog-content blockquote { font-style: italic; border-left: 4px solid #db2777; padding-left: 1.5em; color: #4b5563; background: #fff1f2; padding: 2rem; border-radius: 0 1.5rem 1.5rem 0; margin: 3rem 0; }
                   @media (min-width: 768px) {
                      .blog-content h2 { font-size: 2em; }
                      .blog-content h3 { font-size: 1.5em; }
                   }
                `}</style>
                <div 
                   className="blog-content font-serif text-gray-800 leading-loose"
                   dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
             </div>
             
             <hr className="my-16 border-gray-100" />
             
             <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-[2.5rem] p-8 md:p-12 text-center shadow-lg">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-pink-900 mb-4">Ready to consult with {blog.author}?</h3>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto text-base md:text-lg">Book an appointment today to discuss your health concerns personally.</p>
                <Link to="/contact" className="inline-block bg-pink-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-pink-800 transition-all shadow-xl hover:-translate-y-1 hover:shadow-pink-900/30">
                   Book Appointment
                </Link>
             </div>
          </div>
       </div>
    </div>
  );
};
