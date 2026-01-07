
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { SiteConfig } from '../../types';
import { compressImage } from '../../utils/imageUtils';
import { Save, ShieldCheck, Building, MapPin, Eye, EyeOff, Image as ImageIcon, Loader2, Globe, MessageCircle, Share2, Instagram, Facebook, Youtube, Map, Video, Clock } from 'lucide-react';
import { getYoutubeThumbnail } from '../../utils/youtube';

export const Settings = () => {
  // Initialize with default values so the page loads instantly
  const [config, setConfig] = useState<SiteConfig>({
    name: '',
    doctorName: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    timings: '',
    announcement: '',
    googlePlaceId: '',
    googleMapLink: '',
    doctorImage: '',
    reasonsImage: '',
    aboutVideo: '',
    socials: {
        instagram: '',
        facebook: '',
        youtube: ''
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await storage.getConfig();
      if (data) {
          // Ensure socials object exists
          if (!data.socials) {
              data.socials = { instagram: '', facebook: '', youtube: '' };
          }
          setConfig(data);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config) {
      await storage.updateConfig(config);
      setMsg('Updated!');
      setIsEditing(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'doctorImage' | 'reasonsImage') => {
      const file = e.target.files?.[0];
      if (file) {
          setUploading(true);
          const reader = new FileReader();
          reader.onloadend = async () => {
              try {
                // Compress before upload
                const compressed = await compressImage(reader.result as string);
                setConfig(prev => ({ ...prev, [field]: compressed }));
              } catch (err) {
                console.error("Compression failed", err);
                setConfig(prev => ({ ...prev, [field]: reader.result as string }));
              } finally {
                setUploading(false);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-2xl font-serif font-bold text-pink-900">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Info Card */}
        <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm space-y-6">
           <div className="flex justify-between items-center border-b border-pink-50 pb-4">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                 <Building size={20} />
               </div>
               <h3 className="font-bold text-gray-900">Clinic Information</h3>
             </div>
             <button 
               type="button" 
               onClick={() => setIsEditing(!isEditing)} 
               className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${isEditing ? 'bg-pink-100 text-pink-700' : 'bg-gray-50 text-gray-600 hover:text-pink-600'}`}
             >
               {isEditing ? 'Cancel Edit' : 'Edit Details'}
             </button>
           </div>
           
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Clinic Name</label>
                   <input 
                     disabled={!isEditing} 
                     className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                     value={config.name} 
                     onChange={e => setConfig({...config, name: e.target.value})} 
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Main Doctor Name</label>
                   <input 
                     disabled={!isEditing} 
                     className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                     value={config.doctorName} 
                     onChange={e => setConfig({...config, doctorName: e.target.value})} 
                   />
                 </div>
             </div>

             <div>
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Address</label>
               <input 
                 disabled={!isEditing} 
                 className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                 value={config.address} 
                 onChange={e => setConfig({...config, address: e.target.value})} 
               />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Phone Number</label>
                   <input 
                     disabled={!isEditing} 
                     className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                     value={config.phone} 
                     onChange={e => setConfig({...config, phone: e.target.value})} 
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block flex items-center gap-1"><MessageCircle size={12}/> WhatsApp Number</label>
                   <input 
                     disabled={!isEditing} 
                     placeholder="e.g. 919876543210"
                     className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                     value={config.whatsapp} 
                     onChange={e => setConfig({...config, whatsapp: e.target.value})} 
                   />
                 </div>
             </div>

             <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block flex items-center gap-1"><Clock size={12}/> Clinic Timings</label>
                <input 
                  disabled={!isEditing} 
                  placeholder="e.g. Mon - Sat: 10:00 AM - 08:00 PM"
                  className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                  value={config.timings || ''} 
                  onChange={e => setConfig({...config, timings: e.target.value})} 
                />
             </div>
             
             <div>
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Email Address</label>
               <input 
                 disabled={!isEditing} 
                 className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                 value={config.email} 
                 onChange={e => setConfig({...config, email: e.target.value})} 
               />
             </div>

             <div>
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Google Map Link</label>
               <div className="relative">
                <input 
                  disabled={!isEditing} 
                  placeholder="https://goo.gl/maps/..."
                  className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                  value={config.googleMapLink || ''} 
                  onChange={e => setConfig({...config, googleMapLink: e.target.value})} 
                />
                 {isEditing && (
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500">
                     <Map size={16} />
                   </div>
                 )}
               </div>
             </div>

             <div>
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Google Place ID (Reviews)</label>
               <div className="relative">
                <input 
                  disabled={!isEditing} 
                  placeholder="e.g. ChIJ..."
                  className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                  value={config.googlePlaceId || ''} 
                  onChange={e => setConfig({...config, googlePlaceId: e.target.value})} 
                />
                 {isEditing && (
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500">
                     <MapPin size={16} />
                   </div>
                 )}
               </div>
             </div>

             {/* Media Section */}
             <div className="pt-4 border-t border-pink-50">
                 <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2"><ImageIcon size={16} className="text-pink-600"/> Site Media</h4>
                 
                 {/* Doctor Image */}
                 <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Home Section - Expert Image</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            {config.doctorImage ? (
                                <img src={config.doctorImage} alt="Dr. Sonil" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex-1">
                                 <label className="cursor-pointer bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold py-2 px-4 rounded-lg text-sm inline-flex items-center gap-2 transition-colors">
                                    {uploading ? <Loader2 className="animate-spin" size={16}/> : <ImageIcon size={16}/>}
                                    {uploading ? 'Processing...' : 'Change Image'}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'doctorImage')} disabled={uploading} />
                                 </label>
                                 <p className="text-[10px] text-gray-400 mt-1">Recommended: Portrait format</p>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Reasons Image */}
                 <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Reasons Section - Side Image</label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            {config.reasonsImage ? (
                                <img src={config.reasonsImage} alt="Reasons" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="flex-1">
                                 <label className="cursor-pointer bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold py-2 px-4 rounded-lg text-sm inline-flex items-center gap-2 transition-colors">
                                    {uploading ? <Loader2 className="animate-spin" size={16}/> : <ImageIcon size={16}/>}
                                    {uploading ? 'Processing...' : 'Change Image'}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'reasonsImage')} disabled={uploading} />
                                 </label>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* About Video */}
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block flex items-center gap-1">
                        <Video size={12}/> About Page - Video URL
                    </label>
                    <input 
                      disabled={!isEditing} 
                      placeholder="e.g. https://youtube.com/watch?v=..."
                      className={`w-full p-3 rounded-xl border transition-all ${isEditing ? 'bg-white border-pink-300 ring-4 ring-pink-50 text-gray-900' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                      value={config.aboutVideo || ''} 
                      onChange={e => setConfig({...config, aboutVideo: e.target.value})} 
                    />
                    {config.aboutVideo && (
                         <div className="mt-2 relative rounded-lg overflow-hidden h-24 w-40 bg-gray-100 border">
                             <img src={getYoutubeThumbnail(config.aboutVideo)} alt="Video Preview" className="w-full h-full object-cover opacity-80" />
                         </div>
                    )}
                 </div>
             </div>
           </div>
           
           {/* Social Media Section */}
           <div className="pt-6 border-t border-pink-50">
                <div className="flex items-center gap-2 mb-4">
                   <Share2 size={16} className="text-pink-600" />
                   <h4 className="font-bold text-gray-900 text-sm">Social Media Links</h4>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-3">
                      <Instagram size={18} className="text-pink-600 shrink-0" />
                      <input 
                         disabled={!isEditing} 
                         placeholder="Instagram Profile URL"
                         className={`w-full p-2.5 rounded-xl border transition-all text-sm ${isEditing ? 'bg-white border-pink-300' : 'bg-gray-50 border-transparent text-gray-500'}`}
                         value={config.socials?.instagram || ''} 
                         onChange={e => setConfig({...config, socials: {...config.socials!, instagram: e.target.value}})} 
                      />
                   </div>
                   <div className="flex items-center gap-3">
                      <Facebook size={18} className="text-blue-600 shrink-0" />
                      <input 
                         disabled={!isEditing} 
                         placeholder="Facebook Profile URL"
                         className={`w-full p-2.5 rounded-xl border transition-all text-sm ${isEditing ? 'bg-white border-pink-300' : 'bg-gray-50 border-transparent text-gray-500'}`}
                         value={config.socials?.facebook || ''} 
                         onChange={e => setConfig({...config, socials: {...config.socials!, facebook: e.target.value}})} 
                      />
                   </div>
                   <div className="flex items-center gap-3">
                      <Youtube size={18} className="text-red-600 shrink-0" />
                      <input 
                         disabled={!isEditing} 
                         placeholder="YouTube Channel URL"
                         className={`w-full p-2.5 rounded-xl border transition-all text-sm ${isEditing ? 'bg-white border-pink-300' : 'bg-gray-50 border-transparent text-gray-500'}`}
                         value={config.socials?.youtube || ''} 
                         onChange={e => setConfig({...config, socials: {...config.socials!, youtube: e.target.value}})} 
                      />
                   </div>
                </div>
           </div>

           {isEditing && (
             <button className="w-full bg-pink-900 text-white p-4 rounded-xl font-bold hover:bg-pink-800 transition-colors shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2">
               <Save size={18} /> Save Changes
             </button>
           )}
           {msg && <p className="text-green-600 font-bold text-center bg-green-50 p-3 rounded-xl animate-fade-in">{msg}</p>}
        </form>

        {/* Security Card */}
        <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm h-fit">
           <div className="flex items-center gap-3 border-b border-pink-50 pb-4 mb-6">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-gray-900">Security</h3>
           </div>
           
           <p className="text-sm text-gray-500 mb-4">Update the master access key for the admin portal.</p>
           
           <div className="relative mb-4">
             <input 
               type={showPassword ? "text" : "password"}
               placeholder="Enter New Password" 
               className="w-full bg-pink-50/30 border border-pink-200 text-pink-900 placeholder-pink-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" 
               value={newPassword} 
               onChange={e => setNewPassword(e.target.value)} 
             />
             <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
               title={showPassword ? "Hide password" : "Show password"}
             >
               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
             </button>
           </div>

           <button 
             onClick={() => { storage.changePassword(newPassword); alert('Access Key Updated Successfully'); setNewPassword(''); }} 
             className="w-full bg-gray-900 text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2"
           >
             Update Access Key
           </button>
        </div>
      </div>
    </AdminLayout>
  );
};
