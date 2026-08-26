import { Building2, Activity, Zap, TrendingDown, Users, AlertTriangle, Settings, Plus } from 'lucide-react';
import { useSubscription } from './SubscriptionProvider';
import { Navigate } from 'react-router-dom';

export default function CommercialDashboard() {
  const { isCommercial } = useSubscription();

  if (!isCommercial) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Portfolio Overview</h1>
          <p className="text-slate-400 mt-1">Manage your commercial properties and optimize energy spend at scale.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Properties</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">12</div>
          <div className="text-sm text-slate-400">Active buildings</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Savings</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">$42,500</div>
          <div className="text-sm text-green-400 flex items-center gap-1 font-medium">
            <span>+18%</span>
            <span className="text-slate-500 font-normal">vs last year</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg EUI</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">68.4</div>
          <div className="text-sm text-slate-400">kBtu/sq ft/yr</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alerts</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">3</div>
          <div className="text-sm text-amber-400 font-medium">Requires attention</div>
        </div>
      </div>

      {/* Property List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Property Performance</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Property Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Sq Ft</th>
                <th className="px-6 py-4 font-medium">Monthly Spend</th>
                <th className="px-6 py-4 font-medium">Efficiency Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[
                { name: 'Downtown Office Plaza', type: 'Office', sqft: '120,000', spend: '$14,200', score: 85, status: 'Optimized' },
                { name: 'Westside Retail Center', type: 'Retail', sqft: '85,000', spend: '$9,800', score: 72, status: 'Needs Attention' },
                { name: 'North Industrial Park', type: 'Warehouse', sqft: '250,000', spend: '$22,400', score: 91, status: 'Optimized' },
                { name: 'Sunset Apartments', type: 'Multi-family', sqft: '180,000', spend: '$16,500', score: 68, status: 'Critical' },
              ].map((prop, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{prop.name}</td>
                  <td className="px-6 py-4 text-slate-400">{prop.type}</td>
                  <td className="px-6 py-4 text-slate-400">{prop.sqft}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{prop.spend}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${prop.score >= 80 ? 'bg-green-500' : prop.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${prop.score}%` }}
                        />
                      </div>
                      <span className="text-slate-300">{prop.score}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      prop.status === 'Optimized' ? 'bg-green-500/10 text-green-400' : 
                      prop.status === 'Needs Attention' ? 'bg-amber-500/10 text-amber-400' : 
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
