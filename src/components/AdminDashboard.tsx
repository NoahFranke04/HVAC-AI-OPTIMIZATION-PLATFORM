import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BarChart3, Users, TrendingUp, MousePointer2, Activity, ShieldAlert, Building2, DollarSign, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    conversions: 0,
    activeToday: 0,
    commercialClients: 0,
    mrr: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const fetchStats = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const proUsers = usersSnapshot.docs.filter(doc => doc.data().subscriptionTier === 'pro').length;
      const commercialUsers = usersSnapshot.docs.filter(doc => doc.data().subscriptionTier === 'commercial').length;
      
      setStats({
        totalUsers: usersSnapshot.size,
        conversions: Math.round(((proUsers + commercialUsers) / usersSnapshot.size) * 100) || 0,
        activeToday: Math.floor(usersSnapshot.size * 0.4), // Simulated
        commercialClients: commercialUsers,
        mrr: (proUsers * 29) + (commercialUsers * 99)
      });
    };
    fetchStats();

    return () => unsubscribe();
  }, []);

  const adminStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
    { label: 'Conversion Rate', value: `${stats.conversions}%`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Commercial Clients', value: stats.commercialClients, icon: Building2, color: 'text-purple-400' },
    { label: 'Est. MRR', value: `$${stats.mrr}`, icon: DollarSign, color: 'text-yellow-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          Admin Control Center
          <ShieldAlert className="w-7 h-7 text-red-500" />
        </h1>
        <p className="text-slate-400 mt-1">Platform analytics, B2B sales, and user conversion tracking.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-slate-800 rounded-xl">
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl">
          <div className="p-8 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-blue-400" />
              Live Event Stream
            </h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time updates</span>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="bg-slate-800/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metadata</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 uppercase">
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-400 font-mono">{event.userId.slice(0, 8)}...</td>
                    <td className="px-8 py-4 text-sm text-slate-500">{JSON.stringify(event.metadata || {})}</td>
                    <td className="px-8 py-4 text-sm text-slate-500">
                      {event.timestamp?.toDate().toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    B2B Sales Pipeline
                </h2>
                <div className="space-y-4">
                    {[
                        { company: 'Acme Corp', status: 'Negotiation', value: '$12k/yr' },
                        { company: 'Global Retail', status: 'Demo Scheduled', value: '$45k/yr' },
                        { company: 'Tech Park LLC', status: 'Closed Won', value: '$8k/yr' },
                    ].map((deal, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <div>
                                <p className="text-white font-bold text-sm">{deal.company}</p>
                                <p className="text-slate-400 text-xs mt-1">{deal.status}</p>
                            </div>
                            <span className="text-green-400 font-bold text-sm">{deal.value}</span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors text-sm border border-slate-700">
                    View Full Pipeline
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Team Access
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">NF</div>
                            <div>
                                <p className="text-white text-sm font-bold">Noah Franke</p>
                                <p className="text-slate-400 text-xs">Super Admin</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">JS</div>
                            <div>
                                <p className="text-white text-sm font-bold">Jane Smith</p>
                                <p className="text-slate-400 text-xs">Sales Rep</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors text-sm">
                    Invite Team Member
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
