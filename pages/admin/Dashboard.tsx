import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { storage } from '../../utils/storage';
import { Appointment } from '../../types';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, today: 0, completed: 0 });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const apts = await storage.getAppointments();
      const todayStr = new Date().toISOString().split('T')[0];
      setStats({
        total: apts.length,
        pending: apts.filter(a => a.status === 'pending').length,
        today: apts.filter(a => a.date === todayStr).length,
        completed: apts.filter(a => a.status === 'completed').length
      });
      setRecentAppointments(apts.slice(0, 5));
    };
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Dr. Sonil.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { icon: Users, label: "Patients", val: stats.total, color: "blue" },
          { icon: Clock, label: "Pending", val: stats.pending, color: "orange" },
          { icon: Calendar, label: "Today", val: stats.today, color: "green" },
          { icon: TrendingUp, label: "Done", val: stats.completed, color: "purple" }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border flex items-center gap-4">
             <div className={`p-3 rounded-full bg-${s.color}-50 text-${s.color}-600`}><s.icon size={24} /></div>
             <div><p className="text-xs font-bold text-gray-500 uppercase">{s.label}</p><h3 className="text-2xl font-bold">{s.val}</h3></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="p-6 border-b flex justify-between items-center"><h3 className="font-bold">Recent Bookings</h3><Link to="/admin/appointments" className="text-pink-600 font-bold text-sm">View All</Link></div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-bold uppercase"><tr><th className="p-4">Name</th><th className="p-4">Dept</th><th className="p-4">Status</th></tr></thead>
          <tbody className="divide-y">
            {recentAppointments.map(apt => (
              <tr key={apt.id} className="text-sm">
                <td className="p-4 font-bold">{apt.patientName}</td>
                <td className="p-4">{apt.department}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase">{apt.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};