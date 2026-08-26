import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BarChart3, TrendingUp, DollarSign, Zap, Thermometer, Calculator, Info, Download, FileText, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSubscription } from './SubscriptionProvider';

export default function Analysis({ user }: { user: User }) {
  const [home, setHome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [efficiency, setEfficiency] = useState(14); // SEER rating
  const [energyPrice, setEnergyPrice] = useState(0.14); // $/kWh
  const { isPro, isCommercial, setShowPaywall } = useSubscription();
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchHome = async () => {
      const q = query(collection(db, 'homes'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setHome(snapshot.docs[0].data());
      }
      setLoading(false);
    };
    fetchHome();
  }, [user.uid]);

  const calculateSavings = () => {
    if (!home) return { annual: 0, monthly: 0, roi: 0, currentCost: 0, optimizedCost: 0 };
    const baseUsage = (home.squareFootage || 2000) * 15; // Rough kWh estimate
    const currentCost = baseUsage * energyPrice;
    const optimizedSEER = 20;
    const savingsFactor = 1 - (efficiency / optimizedSEER);
    const annualSavings = baseUsage * savingsFactor * energyPrice;
    const optimizedCost = currentCost - annualSavings;
    return {
      annual: annualSavings.toFixed(2),
      monthly: (annualSavings / 12).toFixed(2),
      roi: (8000 / annualSavings).toFixed(1), // Assuming $8k upgrade
      currentCost,
      optimizedCost
    };
  };

  const savings = calculateSavings();

  const generateProjectionData = () => {
      const data = [];
      let currentCumulative = 0;
      let optimizedCumulative = 8000; // Initial investment for optimized system
      
      for (let year = 1; year <= 10; year++) {
          currentCumulative += savings.currentCost;
          optimizedCumulative += savings.optimizedCost;
          data.push({
              year: `Year ${year}`,
              'Current System': Math.round(currentCumulative),
              'Optimized System': Math.round(optimizedCumulative)
          });
      }
      return data;
  };

  const projectionData = generateProjectionData();

  const handleGenerateReport = () => {
    if (!isPro && !isCommercial) {
      setShowPaywall(true);
      return;
    }
    setGeneratingReport(true);
    // Simulate report generation delay
    setTimeout(() => {
        setGeneratingReport(false);
        // In a real app, this would trigger a file download
        alert("Comprehensive PDF report generated successfully!");
    }, 2000);
  };

  if (loading) return <div className="animate-pulse text-slate-500">Calculating loads...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Energy Analysis
            <Calculator className="w-7 h-7 text-blue-500" />
          </h1>
          <p className="text-slate-400 mt-1">Deep dive into your HVAC performance and ROI projections.</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg",
              generatingReport 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/20 border border-blue-400/30"
          )}
        >
          {generatingReport ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
              <><FileText className="w-4 h-4" /> Export Full Report</>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-blue-400" />
              System Parameters
            </h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">Current SEER Rating</label>
                  <span className="text-blue-400 font-bold">{efficiency}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="25"
                  step="1"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1 uppercase font-bold">
                  <span>Standard</span>
                  <span>High Efficiency</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">Energy Price ($/kWh)</label>
                  <span className="text-green-400 font-bold">${energyPrice}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.01"
                  value={energyPrice}
                  onChange={(e) => setEnergyPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
              <p className="text-xs text-blue-200 leading-relaxed">
                SEER (Seasonal Energy Efficiency Ratio) measures cooling efficiency. Higher ratings mean lower energy bills.
              </p>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2 space-y-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col items-center text-center"
            >
              <div className="p-4 bg-green-500/10 rounded-2xl mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-slate-400 font-medium">Estimated Annual Savings</p>
              <p className="text-5xl font-bold text-white mt-2 tracking-tight">${savings.annual}</p>
              <p className="text-green-400 text-sm font-bold mt-2">~${savings.monthly}/mo</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={cn("bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden", !isPro && !isCommercial && "blur-sm opacity-50 pointer-events-none")}
            >
              <div className="p-4 bg-blue-500/10 rounded-2xl mb-4">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-slate-400 font-medium">Break-even Timeline</p>
              <p className="text-5xl font-bold text-white mt-2 tracking-tight">{savings.roi} Years</p>
              <p className="text-blue-400 text-sm font-bold mt-2">ROI Projection</p>
            </motion.div>
          </div>

          {/* 10-Year Projection Chart */}
          <div className={cn("bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden", !isPro && !isCommercial && "blur-sm opacity-50 pointer-events-none")}>
            <h2 className="text-xl font-bold text-white mb-2">10-Year Cost Projection</h2>
            <p className="text-slate-400 text-sm mb-8">Cumulative cost comparison including initial upgrade investment.</p>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                            itemStyle={{ color: '#e2e8f0' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="Current System" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="Optimized System" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

          {!isPro && !isCommercial && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-auto">
                  <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 text-center shadow-2xl max-w-md mx-auto mt-20 backdrop-blur-md">
                      <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Unlock ROI Analysis</h3>
                      <p className="text-slate-400 mb-6">See exactly when your investment pays for itself and view the 10-year cost projection.</p>
                      <button 
                          onClick={() => setShowPaywall(true)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl w-full transition-colors shadow-lg shadow-blue-900/20"
                      >
                          Upgrade to Pro
                      </button>
                  </div>
              </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Load Estimation (BTU/hr)</h2>
            <div className="space-y-6">
              {[
                { label: 'Cooling Load', value: (home?.squareFootage || 2000) * 20, color: 'bg-blue-500' },
                { label: 'Heating Load', value: (home?.squareFootage || 2000) * 40, color: 'bg-red-500' },
              ].map((load) => (
                <div key={load.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-400">{load.label}</span>
                    <span className="text-white font-bold">{load.value.toLocaleString()} BTU</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '70%' }}
                      className={cn("h-full rounded-full", load.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-6 italic">
              *Estimates based on square footage and standard insulation. Use the Blueprint Tool for precision sizing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
