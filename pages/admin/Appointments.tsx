import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { Appointment } from '../../types';
import { Check, X, Search, Filter } from 'lucide-react';

export const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setAppointments(await storage.getAppointments());
  };

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    await storage.updateAppointmentStatus(id, status);
    await refresh();
  };

  const filtered = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-serif font-bold text-pink-900">Manage Bookings</h1>
           <p className="text-gray-500 text-sm">Track and manage patient appointments.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
             <input 
               type="text" 
               placeholder="Search Patient..." 
               className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-pink-50/50 border border-pink-200 rounded-xl text-pink-900 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" 
               value={searchTerm} 
               onChange={e => setSearchTerm(e.target.value)} 
             />
          </div>
          <div className="relative">
            <select 
               className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-pink-200 rounded-xl text-pink-900 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm cursor-pointer" 
               value={filter} 
               onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
           <div className="text-center py-12 bg-white rounded-3xl border border-pink-100 border-dashed">
              <p className="text-gray-400">No appointments found.</p>
           </div>
        )}
        
        {filtered.map(apt => (
          <div key={apt.id} className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div className="flex items-start gap-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-xl font-bold ${apt.status === 'confirmed' ? 'bg-green-100 text-green-600' : apt.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                 {apt.patientName.charAt(0)}
               </div>
               <div>
                 <h3 className="font-bold text-gray-900 text-lg">{apt.patientName}</h3>
                 <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1 font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded">{apt.department}</span>
                    <span>{apt.phone}</span>
                    <span className="text-gray-300">|</span>
                    <span>{apt.date || 'No Date'}</span>
                 </div>
                 {apt.reason && <p className="text-gray-400 text-sm mt-2 italic">"{apt.reason}"</p>}
               </div>
             </div>
             
             <div className="flex items-center gap-3 self-end md:self-center">
                {apt.status === 'pending' ? (
                  <>
                    <button onClick={() => handleStatusUpdate(apt.id, 'confirmed')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                      <Check size={18} /> Confirm
                    </button>
                    <button onClick={() => handleStatusUpdate(apt.id, 'cancelled')} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors">
                      <X size={18} /> Cancel
                    </button>
                  </>
                ) : (
                   <span className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider ${
                      apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' : 
                      apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' : 
                      'bg-gray-100 text-gray-600'
                   }`}>
                      {apt.status}
                   </span>
                )}
             </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};