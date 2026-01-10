
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { BlogPost } from '../../types';
import { compressImage } from '../../utils/imageUtils';
import { Plus, Trash2, Edit2, X, Check, UploadCloud, Loader2, AlertTriangle, Eye } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { Link } from 'react-router-dom';
import { RichTextEditor } from '../../components/RichTextEditor';

export const BlogManager = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    summary: '',
    content: '',
    image: '',
    author: 'Dr. Sonil'
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    const data = await storage.getBlogs();
    setBlogs(data);
    setLoading(false);
  };

  const handleOpenModal = (blog?: BlogPost) => {
    if (blog) {
      setFormData({
        id: blog.id,
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        image: blog.image,
        author: blog.author
      });
    } else {
      setFormData({
        id: '',
        title: '',
        summary: '',
        content: '',
        image: '',
        author: 'Dr. Sonil'
      });
    }
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
           // HIGH QUALITY COMPRESSION FOR BLOGS
           const compressed = await compressImage(reader.result as string, 1920, 0.98);
           setFormData((prev: any) => ({ ...prev, image: compressed }));
           showToast('High-quality image processed', 'info');
        } catch (err) {
           setFormData((prev: any) => ({ ...prev, image: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload handler passed to RichTextEditor
  const handleRichTextUpload = async (file: File): Promise<string> => {
     return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
           try {
              // 1. Compress
              const compressed = await compressImage(reader.result as string, 1200, 0.9);
              // 2. Upload
              const url = await storage.uploadMedia(compressed);
              resolve(url);
           } catch (e) {
              reject(e);
           }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
     });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.image) {
      showToast('Please upload a cover image', 'error');
      return;
    }
    
    setUploading(true);
    try {
      if (formData.id) {
        await storage.updateBlog(formData.id, formData);
        showToast('Blog updated successfully', 'success');
      } else {
        await storage.addBlog(formData);
        showToast('Blog published successfully', 'success');
      }
      await refreshData();
      setModalOpen(false);
    } catch (err) {
      showToast('Operation failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
        try {
            await storage.deleteBlog(deleteId);
            showToast('Blog deleted', 'success');
            refreshData();
        } catch (error) {
            showToast('Failed to delete blog', 'error');
        } finally {
            setDeleteId(null);
        }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-serif font-bold text-pink-900">Blog Manager</h1>
           <p className="text-gray-500 text-sm">Write and manage health articles with rich content.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-pink-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-pink-800 transition-colors flex items-center gap-2 shadow-lg shadow-pink-900/20">
          <Plus size={18} /> Write Article
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-pink-600" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
               <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
               </div>
               
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                     <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                     <span>•</span>
                     <span>{blog.author}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{blog.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{blog.summary}</p>
               </div>

               <div className="flex gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                 <Link to={`/blogs/${blog.id}`} target="_blank" className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex-1 md:flex-none text-center"><Eye size={18} /></Link>
                 <button onClick={() => handleOpenModal(blog)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex-1 md:flex-none text-center"><Edit2 size={18} /></button>
                 <button onClick={() => setDeleteId(blog.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex-1 md:flex-none text-center"><Trash2 size={18} /></button>
               </div>
            </div>
          ))}
          {blogs.length === 0 && <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400">No blogs found. Start writing!</div>}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
               <h3 className="text-xl font-bold text-gray-900">{formData.id ? 'Edit Article' : 'New Article'}</h3>
               <button type="button" onClick={() => setModalOpen(false)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Image & Metadata */}
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cover Image</label>
                      <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group">
                          {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400 text-xs">No Image</div>}
                          <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                             <UploadCloud size={24} className="mb-1" />
                             <span className="text-xs font-bold">Change Image</span>
                             <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                          </label>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">High quality (1920px+) supported</p>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author Name</label>
                      <input 
                        className="w-full p-3 bg-gray-50 rounded-xl border text-sm" 
                        value={formData.author} 
                        onChange={e => setFormData({...formData, author: e.target.value})} 
                      />
                   </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-2 space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                      <input 
                        className="w-full p-3 bg-gray-50 rounded-xl border font-serif font-bold text-lg" 
                        placeholder="Article Headline..."
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        required
                      />
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Summary</label>
                      <textarea 
                        rows={2}
                        className="w-full p-3 bg-gray-50 rounded-xl border text-sm" 
                        placeholder="Brief overview..."
                        value={formData.summary} 
                        onChange={e => setFormData({...formData, summary: e.target.value})} 
                        required
                      />
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Content</label>
                      <RichTextEditor 
                        value={formData.content} 
                        onChange={(val) => setFormData({...formData, content: val})} 
                        onImageUpload={handleRichTextUpload}
                        className="min-h-[400px]"
                      />
                   </div>
                </div>
             </div>

             <div className="border-t mt-8 pt-6 flex justify-end gap-3">
               <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
               <button type="submit" disabled={uploading} className="bg-pink-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-800 transition-colors flex items-center gap-2 shadow-lg">
                 {uploading ? <Loader2 className="animate-spin" /> : <Check size={20} />} 
                 {formData.id ? 'Update Article' : 'Publish Article'}
               </button>
             </div>
           </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-full animate-fade-in">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Delete Article?</h3>
                <p className="text-gray-500 mb-8 text-sm">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-gray-50 font-bold rounded-xl text-gray-600 hover:bg-gray-100">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 font-bold text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20">Delete</button>
                </div>
           </div>
        </div>
      )}
    </AdminLayout>
  );
};
