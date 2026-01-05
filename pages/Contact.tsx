
import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { MapSection } from '../components/MapSection';
import { storage } from '../utils/storage';
import { SiteConfig } from '../types';

export const Contact = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [formData, setFormData] = useState({ patientName: '', phone: '', department: '', date: '', reason: '' });
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    const load = async () => {
      const data = await storage.getConfig();
      setConfig(data);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.phone) return;
    await storage.addAppointment(formData);
    setStatus('success');
    setFormData({ patientName: '', phone: '', department: '', date: '', reason: '' });
    setTimeout(() => setStatus('idle'), 5000);
  };

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
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-pink-500 space-y-6">
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

        <div className="lg:col-span-2 bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-serif font-bold mb-8">Book Appointment</h2>
          {status === 'success' ? (
            <div className="bg-green-50 p-8 rounded-xl text-center">Request Received! We'll call you shortly.</div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <input required placeholder="Name" className="p-3 bg-gray-50 rounded border" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                <input required placeholder="Phone" className="p-3 bg-gray-50 rounded border" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <select className="w-full p-3 bg-gray-50 rounded border" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="">Department</option>
                <option value="IVF">IVF</option>
                <option value="Surgery">Surgery</option>
                <option value="Checkup">General Checkup</option>
              </select>
              <textarea rows={3} placeholder="Reason" className="w-full p-3 bg-gray-50 rounded border" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              <button className="w-full bg-pink-600 text-white font-bold py-4 rounded-lg uppercase hover:bg-pink-700 transition-colors">Confirm Booking</button>
            </form>
          )}
        </div>
      </div>
      <MapSection />
    </div>
  );
};
