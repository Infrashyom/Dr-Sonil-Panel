
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { Appointment } from '../../types';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, today: 0, confirmed: 0 });
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      // Storage uses no-store cache now, so this will be fresh
      const apts = await storage.getAppointments();
      const todayStr = new Date().toISOString().split('T')[0];
      
      const todays = apts.filter(a => a.date === todayStr);

      setStats({
        total: apts.length,
        pending: apts.filter(a => a.status === 'pending').length,
        today: todays.length,
        confirmed: apts.filter(a => a.status === 'confirmed').length
      });
      
      // Show all of today's appointments
      setTodaysAppointments(todays);
    };
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-pink-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Dr. Sonil.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4">
             <div className="p-3 rounded-full bg-blue-50 text-blue-600"><Users size={24} /></div>
             <div><p className="text-xs font-bold text-gray-400 uppercase">Total Patients</p><h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
             <div className="p-3 rounded-full bg-orange-50 text-orange-600"><Clock size={24} /></div>
             <div><p className="text-xs font-bold text-gray-400 uppercase">Pending</p><h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4">
             <div className="p-3 rounded-full bg-pink-50 text-pink-600"><Calendar size={24} /></div>
             <div><p className="text-xs font-bold text-gray-400 uppercase">Today</p><h3 className="text-2xl font-bold text-gray-900">{stats.today}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm flex items-center gap-4">
             <div className="p-3 rounded-full bg-green-50 text-green-600"><CheckCircle size={24} /></div>
             <div><p className="text-xs font-bold text-gray-400 uppercase">Confirmed</p><h3 className="text-2xl font-bold text-gray-900">{stats.confirmed}</h3></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-pink-600"/> Today's Appointments
            </h3>
            <Link to="/admin/appointments" className="text-pink-600 font-bold text-sm hover:underline">View All</Link>
        </div>
        
        {todaysAppointments.length === 0 ? (
            <div className="p-12 text-center">
                <p className="text-gray-400">No appointments scheduled for today.</p>
            </div>
        ) : (
            <table className="w-full text-left">
            <thead className="bg-white text-xs font-bold uppercase text-gray-400 border-b border-gray-100">
                <tr>
                    <th className="p-5">Date</th>
                    <th className="p-5">Patient Name</th>
                    <th className="p-5">Department</th>
                    <th className="p-5">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {todaysAppointments.map(apt => (
                <tr key={apt.id} className="text-sm hover:bg-pink-50/30 transition-colors">
                    <td className="p-5 font-bold text-gray-600 font-mono">{apt.date}</td>
                    <td className="p-5 font-bold text-gray-900">{apt.patientName}</td>
                    <td className="p-5 text-gray-600">{apt.department}</td>
                    <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-100' :
                            apt.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                            'bg-orange-50 text-orange-700 border border-orange-100'
                        }`}>
                            {apt.status}
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </AdminLayout>
  );
};
