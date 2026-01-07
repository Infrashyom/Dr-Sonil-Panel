
import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';
import { MapSection } from '../components/MapSection';
import { storage } from '../utils/storage';
import { SiteConfig } from '../types';

export const Contact = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [formData, setFormData] = useState({ patientName: '', phone: '', department: '', date: '', reason: '' });
  const [errors, setErrors] = useState<{ patientName?: string; phone?: string; department?: string; date?: string }>({});
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const MAX_REASON_LENGTH = 100;

  useEffect(() => {
    const load = async () => {
      const data = await storage.getConfig();
      setConfig(data);
    };
    load();
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Name Validation
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Required';
      isValid = false;
    } else if (formData.patientName.length < 3) {
      newErrors.patientName = 'Min 3 chars';
      isValid = false;
    }

    // Phone Validation (Basic 10 digit check)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone) {
      newErrors.phone = 'Required';
      isValid = false;
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Invalid number';
      isValid = false;
    }

    // Department Validation
    if (!formData.department) {
      newErrors.department = 'Required';
      isValid = false;
    }

    // Date Validation
    if (!formData.date) {
      newErrors.date = 'Required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await storage.addAppointment(formData);
    setStatus('success');
    setFormData({ patientName: '', phone: '', department: '', date: '', reason: '' });
    setErrors({});
    setTimeout(() => setStatus('idle'), 5000);
  };

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (!config) return null;

  const mapLink = config.googleMapLink || (config.googlePlaceId 
    ? `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${config.googlePlaceId}` 
    : "#");

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-pink-900 py-24 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Contact Us</h1>
        <p className="text-pink-100">{config.timings}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-20">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-pink-500 space-y-6 h-fit">
           <div className="flex gap-4">
               <MapPin className="text-pink-600 shrink-0" /> 
               <div>
                   <h4 className="font-bold">Visit Us</h4>
                   <a href={mapLink} target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-pink-600 transition-colors block mt-1">{config.address}</a>
               </div>
           </div>
           <div className="flex gap-4"><Phone className="text-pink-600 shrink-0" /> <div><h4 className="font-bold">Call Us</h4><p className="text-sm text-gray-600 mt-1">{config.phone}</p></div></div>
           <div className="flex gap-4"><Mail className="text-pink-600 shrink-0" /> <div><h4 className="font-bold">Email</h4><p className="text-sm text-gray-600 mt-1">{config.email}</p></div></div>
           <div className="flex gap-4"><Clock className="text-pink-600 shrink-0" /> <div><h4 className="font-bold">Timings</h4><p className="text-sm text-gray-600 mt-1">{config.timings}</p></div></div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 flex items-center gap-2 text-pink-900">
            <Calendar className="text-pink-600" size={24} /> Book Appointment
          </h2>
          
          {status === 'success' ? (
            <div className="bg-green-50 p-8 rounded-xl text-center flex flex-col items-center justify-center animate-fade-in border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Request Received!</h3>
              <p className="text-sm text-gray-600">We have received your appointment request. Our team will call you shortly to confirm.</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Patient Name</label>
                  <input 
                    placeholder="Enter Full Name" 
                    className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all placeholder:font-normal ${errors.patientName ? 'border-red-300 focus:ring-red-200 bg-red-50/50' : 'border-gray-100 focus:border-pink-300 focus:ring-pink-100 hover:bg-white'}`} 
                    value={formData.patientName} 
                    onChange={e => setFormData({...formData, patientName: e.target.value})} 
                  />
                  {errors.patientName && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.patientName}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Phone Number</label>
                  <input 
                    placeholder="10-digit Mobile Number" 
                    type="tel"
                    className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all placeholder:font-normal ${errors.phone ? 'border-red-300 focus:ring-red-200 bg-red-50/50' : 'border-gray-100 focus:border-pink-300 focus:ring-pink-100 hover:bg-white'}`}
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Preferred Date</label>
                   <input 
                     type="date" 
                     min={minDate} 
                     className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all text-gray-600 ${errors.date ? 'border-red-300 focus:ring-red-200 bg-red-50/50' : 'border-gray-100 focus:border-pink-300 focus:ring-pink-100 hover:bg-white'}`}
                     value={formData.date} 
                     onChange={e => setFormData({...formData, date: e.target.value})} 
                   />
                   {errors.date && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.date}</p>}
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Department</label>
                   <div className="relative">
                       <select 
                          className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${!formData.department ? 'text-gray-400 font-normal' : 'text-gray-900'} ${errors.department ? 'border-red-300 focus:ring-red-200 bg-red-50/50' : 'border-gray-100 focus:border-pink-300 focus:ring-pink-100 hover:bg-white'}`}
                          value={formData.department} 
                          onChange={e => setFormData({...formData, department: e.target.value})}
                       >
                          <option value="" disabled>Select Department</option>
                          <option value="IVF">IVF</option>
                          <option value="Gynecology">Gynecology</option>
                          <option value="Maternity">Maternity</option>
                          <option value="Checkup">General Checkup</option>
                          <option value="Others">Others</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                           <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                   </div>
                    {errors.department && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.department}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1 flex justify-between">
                    <span>Reason for Visit</span>
                    <span className={`${formData.reason.length > MAX_REASON_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                        {formData.reason.length}/{MAX_REASON_LENGTH}
                    </span>
                </label>
                <textarea 
                    rows={3} 
                    placeholder="Briefly describe your problem (Max 100 characters)..." 
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all placeholder:font-normal hover:bg-white resize-none" 
                    value={formData.reason} 
                    maxLength={MAX_REASON_LENGTH}
                    onChange={e => setFormData({...formData, reason: e.target.value})} 
                />
              </div>

              <button className="w-full bg-pink-900 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs hover:bg-pink-800 transition-all shadow-lg shadow-pink-900/20 active:scale-[0.99] mt-2">
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </div>
      <MapSection />
    </div>
  );
};
