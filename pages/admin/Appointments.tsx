
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { Appointment } from '../../types';
import { Check, X, Search, Calendar, ChevronLeft, ChevronRight, AlertTriangle, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '../../components/Toast';

export const Appointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    id: string | null;
    status: Appointment['status'] | null;
    actionLabel: string;
  }>({
    isOpen: false,
    id: null,
    status: null,
    actionLabel: ''
  });
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(''); // Empty = All dates
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async (silent = false) => {
    if (!silent) setLoading(true);
    const data = await storage.getAppointments();
    setAppointments(data);
    if (!silent) setLoading(false);
  };

  const initiateStatusUpdate = (id: string, status: Appointment['status']) => {
    let actionLabel = '';
    if (status === 'confirmed') actionLabel = 'Confirm';
    else if (status === 'cancelled') actionLabel = 'Cancel';
    else if (status === 'pending') actionLabel = 'Reopen';
    else actionLabel = 'Update';

    setConfirmation({
        isOpen: true,
        id,
        status,
        actionLabel
    });
  };

  const executeStatusUpdate = async () => {
    const { id, status } = confirmation;
    if (!id || !status) return;

    const previousAppointments = [...appointments];

    setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status } : apt
    ));

    setConfirmation({ isOpen: false, id: null, status: null, actionLabel: '' });

    try {
        await storage.updateAppointmentStatus(id, status);
        if (status === 'confirmed') showToast('Appointment Confirmed', 'success');
        if (status === 'cancelled') showToast('Appointment Cancelled', 'error');
        if (status === 'pending') showToast('Appointment Reopened', 'info');
        refresh(true);
    } catch (error) {
        console.error("Failed to update status", error);
        setAppointments(previousAppointments);
        showToast('Failed to save status. Please try again.', 'error');
    }
  };

  // --- FILTERING ---
  const filtered = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.phone.includes(searchTerm);
    const matchesDate = filterDate === '' || apt.date === filterDate;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setFilterDate('');
    setFilterStatus('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
         <h1 className="text-xl font-serif font-bold text-pink-900">Appointment Manager</h1>
         <p className="text-gray-500 text-xs">Manage patient bookings.</p>
      </div>

      {/* Filters Toolbar - Compact */}
      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-4 flex flex-col lg:flex-row gap-3 justify-between items-center">
         <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-56">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <input 
                 type="text" 
                 placeholder="Search Patient..." 
                 className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 text-xs"
                 value={searchTerm}
                 onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
               />
            </div>
            <button 
              onClick={clearFilters} 
              className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Clear
            </button>
         </div>

         <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
             <input 
               type="date" 
               className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-600"
               value={filterDate}
               onChange={e => { setFilterDate(e.target.value); setCurrentPage(1); }}
             />
             <select 
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer text-gray-600"
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
             >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
             </select>
         </div>
      </div>

      {/* Table Container - Flex Column to push pagination to bottom */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
         {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <Loader2 className="animate-spin text-pink-600" size={24} />
           </div>
         ) : (
           <>
             <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-50 border-b border-gray-200">
                     <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-1/4">Patient Details</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Department</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                     <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {paginatedData.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="p-8 text-center text-xs text-gray-400">No appointments found.</td>
                     </tr>
                   ) : (
                     paginatedData.map((apt) => (
                       <tr key={apt.id} className="hover:bg-pink-50/20 transition-colors group">
                         <td className="px-4 py-3">
                           <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 ${
                                apt.status === 'confirmed' ? 'bg-green-500' :
                                apt.status === 'cancelled' ? 'bg-red-400' :
                                'bg-pink-400'
                             }`}>
                               {apt.patientName.charAt(0)}
                             </div>
                             <div className="min-w-0">
                               <div className="font-bold text-gray-900 text-sm truncate">{apt.patientName}</div>
                               <div className="text-[11px] text-gray-500 font-mono">{apt.phone}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-4 py-3">
                             <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 whitespace-nowrap">
                               <Calendar size={12} className="text-pink-400" /> 
                               {apt.date}
                             </span>
                         </td>
                         <td className="px-4 py-3">
                           <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200 whitespace-nowrap">
                             {apt.department}
                           </span>
                         </td>
                         <td className="px-4 py-3 max-w-[200px]">
                            {apt.reason ? (
                              <div className="flex items-start gap-1.5 group/reason cursor-help" title={apt.reason}>
                                  <MessageSquare size={12} className="text-gray-300 mt-0.5 shrink-0" />
                                  <span className="text-xs text-gray-500 truncate block">
                                      {apt.reason}
                                  </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-300 italic">-</span>
                            )}
                         </td>
                         <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                              apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                              apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {apt.status === 'confirmed' && <Check size={10} className="mr-1" />}
                              {apt.status}
                            </span>
                         </td>
                         <td className="px-4 py-3 text-right">
                           <div className="flex justify-end gap-1">
                             {apt.status === 'pending' && (
                               <>
                                 <button 
                                   onClick={() => initiateStatusUpdate(apt.id, 'confirmed')}
                                   className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 border border-green-200 transition-colors"
                                   title="Confirm"
                                 >
                                   <Check size={14} />
                                 </button>
                                 <button 
                                   onClick={() => initiateStatusUpdate(apt.id, 'cancelled')}
                                   className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 border border-red-200 transition-colors"
                                   title="Cancel"
                                 >
                                   <X size={14} />
                                 </button>
                               </>
                             )}
                             {apt.status === 'confirmed' && (
                                <button 
                                   onClick={() => initiateStatusUpdate(apt.id, 'cancelled')}
                                   className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 rounded border border-red-100 hover:bg-red-100 transition-colors"
                                >
                                   Cancel
                                </button>
                             )}
                             {apt.status === 'cancelled' && (
                                <button 
                                  onClick={() => initiateStatusUpdate(apt.id, 'pending')}
                                  className="text-[10px] font-bold text-blue-600 hover:underline px-2"
                                >
                                  Reopen
                                </button>
                             )}
                           </div>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>

             {/* Pagination - Fixed at bottom */}
             {filtered.length > 0 && (
               <div className="bg-gray-50 border-t border-gray-200 p-3 flex items-center justify-between shrink-0">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                     Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} - {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex gap-2">
                     <button 
                       disabled={currentPage === 1}
                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                       className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-pink-600 hover:border-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                     >
                       <ChevronLeft size={14} />
                       <span className="text-[10px] font-bold hidden sm:inline">Previous</span>
                     </button>
                     <button 
                       disabled={currentPage === totalPages || totalPages === 0}
                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                       className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-pink-600 hover:border-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                     >
                       <span className="text-[10px] font-bold hidden sm:inline">Next</span>
                       <ChevronRight size={14} />
                     </button>
                  </div>
               </div>
             )}
           </>
         )}
      </div>

      {/* Confirmation Modal */}
      {confirmation.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-fade-in border border-gray-100">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                   confirmation.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                   confirmation.status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
               }`}>
                  {confirmation.status === 'confirmed' ? <Check size={24}/> : <AlertTriangle size={24}/>}
               </div>
               
               <h3 className="text-lg font-serif font-bold text-center text-gray-900 mb-1">
                  {confirmation.actionLabel} Appointment?
               </h3>
               
               <p className="text-center text-gray-500 text-xs mb-6">
                  Action: <strong>{confirmation.actionLabel}</strong> for selected patient.
               </p>

               <div className="flex gap-3">
                  <button 
                    onClick={() => setConfirmation({ ...confirmation, isOpen: false })}
                    className="flex-1 py-2.5 bg-gray-100 font-bold text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeStatusUpdate}
                    className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 text-xs ${
                        confirmation.status === 'confirmed' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-pink-900 hover:bg-pink-800'
                    }`}
                  >
                    Confirm
                  </button>
               </div>
           </div>
        </div>
      )}
    </AdminLayout>
  );
};
