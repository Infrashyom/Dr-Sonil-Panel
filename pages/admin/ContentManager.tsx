
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { ContentItem } from '../../types';
import { compressImage } from '../../utils/imageUtils';
import { Plus, Trash2, Edit2, X, Check, UploadCloud, Loader2, AlertTriangle } from 'lucide-react';
import { IconMapper, AVAILABLE_ICONS } from '../../components/IconMapper';
import { useToast } from '../../components/Toast';

const TABS = [
  { id: 'doctor', label: 'Doctors Team' },
  { id: 'service', label: 'Services' },
  { id: 'faq', label: 'FAQs' },
  { id: 'testimonial', label: 'Testimonials' },
];

export const ContentManager = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('doctor');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    setLoading(true);
    const data = await storage.getContent(activeTab);
    setItems(data);
    setLoading(false);
  };

  const handleOpenModal = (item?: ContentItem) => {
    setEditingItem(item || null);
    // Initialize form based on tab
    if (item) {
      setFormData(item.data);
    } else {
      setFormData(getInitialData(activeTab));
    }
    setModalOpen(true);
  };

  const getInitialData = (type: string) => {
    switch (type) {
      case 'doctor': return { name: '', role: '', specialties: [], qualifications: [], image: '', socials: {} };
      case 'service': return { id: Date.now().toString(), title: '', description: '', icon: 'Activity', details: [] };
      case 'faq': return { question: '', answer: '' };
      case 'testimonial': return { name: '', rating: 5, text: '', type: 'text' };
      default: return {};
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (editingItem) {
        await storage.updateContent(editingItem._id, formData);
        showToast('Updated successfully', 'success');
      } else {
        await storage.addContent(activeTab, formData);
        showToast('Added successfully', 'success');
      }
      await refreshData();
      setModalOpen(false);
    } catch (err) {
      showToast('Operation failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
        try {
            await storage.deleteContent(deleteId);
            showToast('Item deleted', 'success');
            refreshData();
        } catch (error) {
            showToast('Failed to delete item', 'error');
        } finally {
            setDeleteId(null);
        }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
           const compressed = await compressImage(reader.result as string);
           setFormData((prev: any) => ({ ...prev, image: compressed }));
           showToast('Image processed', 'info');
        } catch (err) {
           console.error("Compression failed", err);
           setFormData((prev: any) => ({ ...prev, image: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-serif font-bold text-pink-900">Content Manager</h1>
           <p className="text-gray-500 text-sm">Update website content dynamically.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-pink-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-pink-800 transition-colors flex items-center gap-2">
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-pink-100 text-pink-800 border-pink-200' : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-pink-600" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <div key={item._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
               {/* Preview Content based on Type */}
               <div className="flex-1">
                  {activeTab === 'doctor' && (
                    <div className="flex gap-4 items-center">
                       <img src={item.data.image} alt={item.data.name} className="w-16 h-16 rounded-full object-cover border" />
                       <div>
                          <h3 className="font-bold text-lg">{item.data.name}</h3>
                          <p className="text-pink-600 text-sm">{item.data.role}</p>
                       </div>
                    </div>
                  )}
                  {activeTab === 'service' && (
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                          <IconMapper name={item.data.icon} size={24} />
                       </div>
                       <div>
                          <h3 className="font-bold">{item.data.title}</h3>
                          <p className="text-gray-500 text-sm">{item.data.description}</p>
                       </div>
                    </div>
                  )}
                  {activeTab === 'faq' && (
                    <div>
                       <h3 className="font-bold text-gray-900 mb-1">Q: {item.data.question}</h3>
                       <p className="text-gray-500 text-sm">A: {item.data.answer}</p>
                    </div>
                  )}
                  {activeTab === 'testimonial' && (
                    <div>
                       <div className="flex gap-1 text-yellow-400 mb-1 text-xs">{"★".repeat(item.data.rating)}</div>
                       <p className="italic text-gray-600 text-sm mb-2">"{item.data.text}"</p>
                       <p className="font-bold text-xs">- {item.data.name}</p>
                    </div>
                  )}
               </div>

               {/* Actions */}
               <div className="flex gap-2 shrink-0">
                 <button onClick={() => handleOpenModal(item)} className="p-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-50"><Edit2 size={18} /></button>
                 <button onClick={() => handleDeleteClick(item._id)} className="p-2 bg-gray-50 text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={18} /></button>
               </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-center py-12 text-gray-400">No items found. Add one!</div>}
        </div>
      )}

      {/* Generic Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
               <h3 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit' : 'Add'} {TABS.find(t => t.id === activeTab)?.label.slice(0, -1)}</h3>
               <button type="button" onClick={() => setModalOpen(false)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
             </div>

             <div className="space-y-4">
                {/* DOCTOR FIELDS */}
                {activeTab === 'doctor' && (
                   <>
                     <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border">
                           {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>}
                        </div>
                        <label className="cursor-pointer bg-pink-50 text-pink-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                           <UploadCloud size={16} /> Upload Photo
                           <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                     </div>
                     <input placeholder="Name (e.g., Dr. Sonil)" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                     <input placeholder="Role / Designation" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
                     <textarea placeholder="Qualifications (comma separated)" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.qualifications} onChange={e => setFormData({...formData, qualifications: e.target.value.split(',')})} />
                     <textarea placeholder="Specialties (comma separated)" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value.split(',')})} />
                   </>
                )}

                {/* SERVICE FIELDS */}
                {activeTab === 'service' && (
                  <>
                     <input placeholder="Service Title" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                     <textarea rows={3} placeholder="Description" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Select Icon</label>
                           <select className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                             {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                           </select>
                           <div className="mt-2 text-pink-600 flex items-center gap-2 text-sm"><IconMapper name={formData.icon} /> Icon Preview</div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Key Points (Comma separated)</label>
                           <textarea className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value.split(',')})} />
                        </div>
                     </div>
                  </>
                )}

                {/* FAQ FIELDS */}
                {activeTab === 'faq' && (
                   <>
                     <input placeholder="Question" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} required />
                     <textarea rows={4} placeholder="Answer" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} required />
                   </>
                )}

                 {/* TESTIMONIAL FIELDS */}
                {activeTab === 'testimonial' && (
                   <>
                     <input placeholder="Patient Name" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                     <textarea rows={4} placeholder="Review Text" className="w-full p-3 bg-gray-50 rounded-xl border" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required />
                     <div className="flex items-center gap-4">
                        <label>Rating: </label>
                        <input type="number" min="1" max="5" className="w-20 p-2 bg-gray-50 rounded-xl border" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} required />
                     </div>
                   </>
                )}
             </div>

             <button disabled={uploading} className="w-full mt-8 bg-pink-900 text-white p-4 rounded-xl font-bold hover:bg-pink-800 transition-colors flex justify-center items-center gap-2">
               {uploading ? <Loader2 className="animate-spin" /> : <><Check size={20} /> Save Changes</>}
             </button>
           </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-3xl text-center shadow-2xl max-w-sm w-full animate-fade-in">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Delete Item?</h3>
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
