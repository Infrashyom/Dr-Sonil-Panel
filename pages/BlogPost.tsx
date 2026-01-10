
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { BlogPost as BlogPostType } from '../types';
import { ArrowLeft, Calendar, User, Clock, Share2, Loader2 } from 'lucide-react';
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
    <div className="bg-white min-h-screen pt-20">
       {/* Header Image */}
       <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden bg-gray-900">
          <img 
            src={getOptimizedUrl(blog.image, 1600)} 
            alt={blog.title} 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-12 md:pb-20">
             <div className="max-w-4xl mx-auto">
                <Link to="/blogs" className="inline-flex items-center text-pink-200 hover:text-white mb-6 text-sm font-bold uppercase tracking-widest transition-colors"><ArrowLeft size={16} className="mr-2"/> All Articles</Link>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">{blog.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
                   <div className="flex items-center gap-2"><Calendar size={16}/> {new Date(blog.createdAt).toLocaleDateString()}</div>
                   <div className="flex items-center gap-2"><User size={16}/> {blog.author}</div>
                   <button onClick={handleShare} className="flex items-center gap-2 hover:text-pink-300 transition-colors"><Share2 size={16}/> Share</button>
                </div>
             </div>
          </div>
       </div>

       {/* Content */}
       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="prose prose-lg md:prose-xl prose-pink mx-auto">
             <p className="lead text-xl md:text-2xl text-gray-600 font-light italic border-l-4 border-pink-500 pl-6 mb-12">
                {blog.summary}
             </p>
             
             {/* Render Rich Text HTML with specific link styling */}
             <style>{`
                .blog-content a { color: #db2777; text-decoration: underline; font-weight: 500; transition: color 0.2s; }
                .blog-content a:hover { color: #9d174d; }
                .blog-content h2 { margin-top: 2em; margin-bottom: 0.5em; font-weight: 800; color: #1f2937; line-height: 1.3; }
                .blog-content h3 { margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700; color: #374151; }
                .blog-content img { border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); margin: 2rem 0; width: 100%; }
                .blog-content ul { padding-left: 1.5em; list-style-type: disc; margin-bottom: 1.5em; }
                .blog-content ol { padding-left: 1.5em; list-style-type: decimal; margin-bottom: 1.5em; }
                .blog-content blockquote { font-style: italic; border-left: 4px solid #db2777; padding-left: 1em; color: #4b5563; background: #fff1f2; padding: 1.5em; border-radius: 0 1rem 1rem 0; margin: 2rem 0; }
             `}</style>
             <div 
                className="blog-content font-serif text-gray-800 leading-loose"
                dangerouslySetInnerHTML={{ __html: blog.content }} 
             />
          </div>
          
          <hr className="my-16 border-gray-100" />
          
          <div className="bg-pink-50 rounded-3xl p-8 md:p-12 text-center">
             <h3 className="text-2xl font-serif font-bold text-pink-900 mb-4">Ready to consult with {blog.author}?</h3>
             <p className="text-gray-600 mb-8 max-w-lg mx-auto">Book an appointment today to discuss your health concerns personally.</p>
             <Link to="/contact" className="inline-block bg-pink-900 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-pink-800 transition-all shadow-lg hover:-translate-y-1">
                Book Appointment
             </Link>
          </div>
       </div>
    </div>
  );
};
