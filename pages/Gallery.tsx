
import React, { useEffect, useState } from 'react';
import { FadeInUp, AnimatedBlobs } from '../components/Animations';
import { storage } from '../utils/storage';
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from '../utils/youtube';
import { getOptimizedUrl } from '../utils/imageUtils';
import { GalleryItem } from '../types';
import { X, PlayCircle } from 'lucide-react';

export const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      const stored = await storage.getGallery();
      setItems(stored); 
    };
    loadItems();
  }, []);

  const filteredItems = filter === 'all' ? items : items.filter(item => item.category === filter);
  const categories = ['all', 'clinic', 'events', 'patients'];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="pt-40 pb-12 bg-pink-50/50 relative">
        <AnimatedBlobs />
        <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#590d22] mb-6">Life at the Centre</h1>
          <div className="flex justify-center flex-wrap gap-2 mt-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all ${filter === cat ? 'bg-[#590d22] text-white' : 'bg-white text-gray-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} 
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm bg-gray-100"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                {/* Optimization: Resize images to 500px for grid view */}
                <img 
                  src={item.type === 'video' ? getYoutubeThumbnail(item.url) : getOptimizedUrl(item.url, 500)} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  loading="lazy" 
                />
                
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                     <PlayCircle className="text-white w-16 h-16 drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                 <span className="text-white font-bold text-xl">{item.title}</span>
                 {item.type === 'video' && <span className="text-pink-200 text-xs font-bold uppercase tracking-wide mt-1">Watch Video</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-pink-500 transition-colors"><X size={32} /></button>
          
          <div className="w-full max-w-5xl max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
             {selectedItem.type === 'video' ? (
               <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                 <iframe 
                   src={getYoutubeEmbedUrl(selectedItem.url)} 
                   className="w-full h-full" 
                   allow="autoplay; encrypted-media" 
                   allowFullScreen
                   title={selectedItem.title}
                 ></iframe>
               </div>
             ) : (
               // Optimization: Load larger version (1200px) when modal is open
               <img src={getOptimizedUrl(selectedItem.url, 1200)} alt={selectedItem.title} className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg" />
             )}
          </div>
          
          <div className="absolute bottom-10 text-white text-center">
             <h3 className="text-2xl font-serif font-bold">{selectedItem.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};
