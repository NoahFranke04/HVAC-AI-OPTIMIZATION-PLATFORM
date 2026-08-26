import { TrendingUp, DollarSign, BarChart3, ArrowRight, Lock } from 'lucide-react';
import { useSubscription } from './SubscriptionProvider';

export default function FinancialAnalytics() {
  const { isCommercial } = useSubscription();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Advanced Financial Analytics</h1>
        <p className="text-slate-400 mt-1">Deep dive into long-term savings, ROI, and lifecycle costs.</p>
      </div>

      {!isCommercial ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Commercial Feature</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            Advanced financial metrics like NPV, IRR, and 15-year projections are available on the Commercial plan.
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-colors">
            Upgrade to Commercial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">10-Year Savings Projection</h2>
                <select className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option>All Properties</option>
                  <option>Downtown Office Plaza</option>
                </select>
              </div>
              
              {/* Placeholder for actual chart */}
              <div className="h-80 flex items-end justify-between gap-2">
                {[40, 55, 65, 75, 85, 95, 105, 115, 125, 135].map((h, i) => (
                  <div key={i} className="w-full bg-blue-500/20 rounded-t-lg relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap">
                      Year {i + 1}: ${(h * 1200).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm text-slate-500 font-medium">
                <span>Year 1</span>
                <span>Year 5</span>
                <span>Year 10</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Lifecycle Cost Analysis</h2>
              <div className="space-y-6">
                {[
                  { label: 'Initial Investment', value: '$125,000', color: 'bg-slate-600' },
                  { label: 'Operating Costs (10y)', value: '$450,000', color: 'bg-amber-500' },
                  { label: 'Maintenance (10y)', value: '$85,000', color: 'bg-purple-500' },
                  { label: 'Projected Savings (10y)', value: '-$210,000', color: 'bg-green-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white font-bold">{item.value}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Investment Metrics</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Net Present Value (NPV)</p>
                  <p className="text-3xl font-bold text-green-400">$84,200</p>
                  <p className="text-xs text-slate-500 mt-1">Based on 8% discount rate</p>
                </div>
                
                <div className="h-px bg-slate-800" />
                
                <div>
                  <p className="text-slate-400 text-sm mb-1">Internal Rate of Return (IRR)</p>
                  <p className="text-3xl font-bold text-white">18.5%</p>
                  <p className="text-xs text-slate-500 mt-1">Highly favorable investment</p>
                </div>

                <div className="h-px bg-slate-800" />
                
                <div>
                  <p className="text-slate-400 text-sm mb-1">Payback Period</p>
                  <p className="text-3xl font-bold text-white">3.2 Years</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white">Executive Summary</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Implementing the recommended HVAC upgrades across your portfolio will generate <strong className="text-white">$210,000</strong> in net savings over 10 years, significantly reducing your operating expenses and improving overall asset value.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                Download Full Report <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
