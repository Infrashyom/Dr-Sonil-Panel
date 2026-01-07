
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { getYoutubeThumbnail } from '../../utils/youtube';
import { GalleryItem, HeroSlide } from '../../types';
import { compressImage } from '../../utils/imageUtils';
import { Plus, Trash2, X, UploadCloud, AlertTriangle, MonitorPlay, Loader2, Info, Image as ImageIcon, Video, Star } from 'lucide-react';

export const GalleryManager = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'hero'>('gallery');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryModal, setGalleryModal] = useState(false);
  const [galleryDeleteId, setGalleryDeleteId] = useState<string | null>(null);
  
  // Gallery Form State
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [newGalleryItem, setNewGalleryItem] = useState<{ url: string; title: string; category: 'clinic' | 'events' | 'patients', featured: boolean }>({ url: '', title: '', category: 'clinic', featured: false });
  
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroModal, setHeroModal] = useState(false);
  const [heroDeleteId, setHeroDeleteId] = useState<string | null>(null);
  const [newHeroSlide, setNewHeroSlide] = useState({ url: '', title: '', subtitle: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setGalleryItems(await storage.getGallery());
    setHeroSlides(await storage.getHeroSlides());
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: Function) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Compress image before setting state
          const compressed = await compressImage(reader.result as string);
          setter((prev: any) => ({ ...prev, url: compressed }));
        } catch (error) {
          console.error("Compression failed, using original", error);
          setter((prev: any) => ({ ...prev, url: reader.result as string }));
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.url) return;
    setLoading(true);
    await storage.addGalleryItem({ ...newGalleryItem, type: mediaType } as any);
    await refreshData();
    setNewGalleryItem({ url: '', title: '', category: 'clinic', featured: false });
    setLoading(false);
    setGalleryModal(false);
  };

  const deleteGalleryItem = async () => {
    if (galleryDeleteId) {
      await storage.deleteGalleryItem(galleryDeleteId);
      await refreshData();
      setGalleryDeleteId(null);
    }
  };

  const toggleFeatured = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await storage.toggleGalleryFeature(id);
    await refreshData();
  };

  const addHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroSlide.url) return;
    setLoading(true);
    await storage.addHeroSlide({ image: newHeroSlide.url, title: newHeroSlide.title, subtitle: newHeroSlide.subtitle });
    await refreshData();
    setNewHeroSlide({ url: '', title: '', subtitle: '' });
    setLoading(false);
    setHeroModal(false);
  };

  const deleteHeroSlide = async () => {
    if (heroDeleteId) {
      await storage.deleteHeroSlide(heroDeleteId);
      await refreshData();
      setHeroDeleteId(null);
    }
  };

  const getPreviewUrl = () => {
    if (mediaType === 'video') {
       return newGalleryItem.url ? getYoutubeThumbnail(newGalleryItem.url) : '';
    }
    return newGalleryItem.url;
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-pink-900">Media Manager</h1>
        <div className="flex bg-pink-50 p-1 rounded-xl border border-pink-100">
           <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'gallery' ? 'bg-white shadow text-pink-700' : 'text-pink-400 hover:text-pink-600'}`}>Gallery</button>
           <button onClick={() => setActiveTab('hero')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'hero' ? 'bg-white shadow text-pink-700' : 'text-pink-400 hover:text-pink-600'}`}>Banners</button>
        </div>
      </div>

      {activeTab === 'gallery' ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setGalleryModal(true)} className="bg-pink-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-pink-900/20 hover:bg-pink-800 transition-colors flex items-center gap-2">
              <Plus size={18} /> Add Media
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100">
              <Info size={14} />
              <span>Click Star to Feature on Home</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {galleryItems.map(item => (
              <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-pink-100 shadow-sm bg-white">
                <div className="aspect-[4/3] relative">
                   <img 
                     src={item.type === 'video' ? getYoutubeThumbnail(item.url) : item.url} 
                     className="w-full h-full object-cover" 
                     alt={item.title} 
                   />
                   {item.type === 'video' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-pink-600">
                          <MonitorPlay size={20} fill="currentColor" />
                        </div>
                     </div>
                   )}
                </div>
                
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-2">
                   <button 
                    onClick={(e) => toggleFeatured(item.id, e)} 
                    className={`p-2 backdrop-blur rounded-full transition-all shadow-sm ${item.featured ? 'bg-yellow-100 text-yellow-500 hover:bg-yellow-200' : 'bg-white/90 text-gray-400 hover:text-yellow-400 opacity-0 group-hover:opacity-100'}`}
                    title={item.featured ? "Remove from Home" : "Feature on Home"}
                   >
                     <Star size={16} fill={item.featured ? "currentColor" : "none"} />
                   </button>
                   <button 
                    onClick={() => setGalleryDeleteId(item.id)} 
                    className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-pink-900/90 to-transparent text-white text-xs p-3 pt-8 truncate font-medium">
                  {item.title}
                  <span className="block text-[10px] opacity-75 uppercase tracking-wider mt-0.5">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
           <div className="flex items-center justify-between mb-6">
            <button onClick={() => setHeroModal(true)} className="bg-pink-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-pink-900/20 hover:bg-pink-800 transition-colors flex items-center gap-2">
              <Plus size={18} /> Add Banner
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100">
              <Info size={14} />
              <span>Recommended: <strong>1920 x 1080px</strong> (16:9)</span>
            </div>
          </div>
          <div className="space-y-4">
            {heroSlides.map(slide => (
              <div key={slide.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                <img src={slide.image} className="w-32 h-20 object-cover rounded-lg" alt={slide.title} />
                <div className="flex-1">
                  <h4 className="font-bold text-pink-900">{slide.title}</h4>
                  <p className="text-xs text-gray-500">{slide.subtitle}</p>
                </div>
                <button onClick={() => setHeroDeleteId(slide.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/20 backdrop-blur-sm">
          <form onSubmit={addGalleryItem} className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-pink-100">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-serif font-bold text-pink-900">Add Gallery Item</h3>
               <button type="button" onClick={() => setGalleryModal(false)} className="text-gray-400 hover:text-pink-600"><X size={24} /></button>
             </div>
             
             {/* Media Type Selector */}
             <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
               <button 
                 type="button" 
                 onClick={() => setMediaType('image')} 
                 className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mediaType === 'image' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <ImageIcon size={16} /> Image
               </button>
               <button 
                 type="button" 
                 onClick={() => setMediaType('video')} 
                 className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mediaType === 'video' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <Video size={16} /> YouTube Video
               </button>
             </div>

             <div className="mb-6">
                {mediaType === 'image' ? (
                  <label className="block w-full cursor-pointer group">
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setNewGalleryItem)} />
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${newGalleryItem.url ? 'border-pink-300 bg-pink-50' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'}`}>
                      {newGalleryItem.url ? (
                        <img src={newGalleryItem.url} className="w-full h-48 object-cover rounded-lg shadow-sm" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-pink-600">
                          <UploadCloud size={48} className="mb-2" />
                          <span className="text-sm font-medium">Click to upload image</span>
                          <span className="text-xs mt-1 text-gray-300">JPG, PNG up to 10MB</span>
                        </div>
                      )}
                    </div>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <input 
                      type="text"
                      placeholder="Paste YouTube Link Here"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      value={newGalleryItem.url}
                      onChange={e => setNewGalleryItem({...newGalleryItem, url: e.target.value})}
                    />
                    {newGalleryItem.url && (
                       <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                          <img src={getPreviewUrl()} className="w-full h-full object-cover opacity-60" alt="Video Preview" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MonitorPlay className="text-white w-12 h-12" />
                          </div>
                       </div>
                    )}
                  </div>
                )}
             </div>
             
             {loading && mediaType === 'image' && !newGalleryItem.url && <div className="text-center py-4 text-pink-600"><Loader2 className="animate-spin mx-auto"/> Processing...</div>}
             
             <div className="space-y-4">
               <input 
                 type="text" 
                 placeholder="Title" 
                 required 
                 className="w-full bg-pink-50/30 border border-pink-100 text-pink-900 placeholder-pink-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" 
                 value={newGalleryItem.title} 
                 onChange={e => setNewGalleryItem({...newGalleryItem, title: e.target.value})} 
               />
               
               <select
                 value={newGalleryItem.category}
                 onChange={e => setNewGalleryItem({...newGalleryItem, category: e.target.value as any})}
                 className="w-full bg-pink-50/30 border border-pink-100 text-pink-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all appearance-none"
               >
                 <option value="clinic">Clinic</option>
                 <option value="events">Events</option>
                 <option value="patients">Patients</option>
               </select>

               {/* Add Featured Toggle in Creation Form */}
               <div className="flex items-center gap-3 bg-pink-50 p-3 rounded-xl border border-pink-100 cursor-pointer" onClick={() => setNewGalleryItem({...newGalleryItem, featured: !newGalleryItem.featured})}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${newGalleryItem.featured ? 'bg-pink-600 border-pink-600' : 'bg-white border-gray-300'}`}>
                    {newGalleryItem.featured && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-sm font-bold text-gray-700">Feature on Home Page</span>
               </div>
             </div>

             <div className="flex gap-4 mt-8">
               <button type="button" onClick={() => setGalleryModal(false)} className="flex-1 bg-pink-50 text-pink-700 font-bold py-3 rounded-xl hover:bg-pink-100 transition-colors">Cancel</button>
               <button type="submit" disabled={loading} className="flex-1 bg-pink-900 text-white font-bold py-3 rounded-xl hover:bg-pink-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20">
                 {loading ? <Loader2 className="animate-spin" size={18}/> : `Save ${mediaType === 'video' ? 'Video' : 'Photo'}`}
               </button>
             </div>
          </form>
        </div>
      )}

      {/* Hero Modal */}
      {heroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/20 backdrop-blur-sm">
          <form onSubmit={addHeroSlide} className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-pink-100">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-serif font-bold text-pink-900">Add Home Banner</h3>
               <button type="button" onClick={() => setHeroModal(false)} className="text-gray-400 hover:text-pink-600"><X size={24} /></button>
             </div>
             
             <div className="mb-6">
                <label className="block w-full cursor-pointer group">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setNewHeroSlide)} />
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${newHeroSlide.url ? 'border-pink-300 bg-pink-50' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'}`}>
                    {newHeroSlide.url ? (
                      <img src={newHeroSlide.url} className="w-full h-48 object-cover rounded-lg shadow-sm" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-pink-600">
                        <UploadCloud size={48} className="mb-2" />
                        <span className="text-sm font-medium">Click to upload banner</span>
                        <span className="text-xs mt-1 text-gray-300">1920x1080 recommended</span>
                      </div>
                    )}
                  </div>
                </label>
             </div>

             {loading && !newHeroSlide.url && <div className="text-center py-4 text-pink-600"><Loader2 className="animate-spin mx-auto"/> Processing...</div>}
             
             <div className="space-y-4">
               <input 
                 type="text" 
                 placeholder="Main Headline" 
                 required 
                 className="w-full bg-pink-50/30 border border-pink-100 text-pink-900 placeholder-pink-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" 
                 value={newHeroSlide.title} 
                 onChange={e => setNewHeroSlide({...newHeroSlide, title: e.target.value})} 
               />
               <input 
                 type="text" 
                 placeholder="Subtitle / Description" 
                 required 
                 className="w-full bg-pink-50/30 border border-pink-100 text-pink-900 placeholder-pink-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" 
                 value={newHeroSlide.subtitle} 
                 onChange={e => setNewHeroSlide({...newHeroSlide, subtitle: e.target.value})} 
               />
             </div>

             <div className="flex gap-4 mt-8">
               <button type="button" onClick={() => setHeroModal(false)} className="flex-1 bg-pink-50 text-pink-700 font-bold py-3 rounded-xl hover:bg-pink-100 transition-colors">Cancel</button>
               <button type="submit" disabled={loading} className="flex-1 bg-pink-900 text-white font-bold py-3 rounded-xl hover:bg-pink-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20">
                 {loading ? <Loader2 className="animate-spin" size={18}/> : 'Save Banner'}
               </button>
             </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {(galleryDeleteId || heroDeleteId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-900/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Delete Item?</h3>
            <p className="text-gray-500 mb-8 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { setGalleryDeleteId(null); setHeroDeleteId(null); }} className="flex-1 py-3 bg-gray-50 font-bold rounded-xl text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={galleryDeleteId ? deleteGalleryItem : deleteHeroSlide} className="flex-1 py-3 bg-red-500 font-bold text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
