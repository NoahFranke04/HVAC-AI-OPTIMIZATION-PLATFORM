import { MonitorPlay, Sliders, Zap, Thermometer, Wind, Lock, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from './SubscriptionProvider';

export default function DigitalTwin() {
  const { isPro, isCommercial } = useSubscription();
  const hasAccess = isPro || isCommercial;

  const [insulation, setInsulation] = useState(50);
  const [hvacEfficiency, setHvacEfficiency] = useState(70);
  const [setpoint, setSetpoint] = useState(72);

  // Simulated calculation based on sliders
  const baseCost = 250;
  const savings = ((100 - insulation) * 0.5) + ((100 - hvacEfficiency) * 0.8) + (Math.abs(72 - setpoint) * 5);
  const currentCost = Math.max(50, baseCost - savings);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Interactive Digital Twin</h1>
        <p className="text-slate-400 mt-1">Simulate upgrades and see the financial impact in real-time.</p>
      </div>

      {!hasAccess ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Pro Feature</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            The interactive Digital Twin allows you to model scenarios and see instant ROI calculations. Available on Pro and Commercial plans.
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-colors">
            Upgrade Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Simulation Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Scenario Variables</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium flex items-center gap-2"><Wind className="w-4 h-4 text-slate-500"/> Insulation Quality</span>
                  <span className="text-blue-400 font-bold">{insulation}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={insulation} 
                  onChange={(e) => setInsulation(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium flex items-center gap-2"><Zap className="w-4 h-4 text-slate-500"/> HVAC Efficiency (SEER)</span>
                  <span className="text-blue-400 font-bold">{hvacEfficiency}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={hvacEfficiency} 
                  onChange={(e) => setHvacEfficiency(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Old System</span>
                  <span>High-Efficiency</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium flex items-center gap-2"><Thermometer className="w-4 h-4 text-slate-500"/> Target Temp</span>
                  <span className="text-blue-400 font-bold">{setpoint}°F</span>
                </div>
                <input 
                  type="range" 
                  min="65" max="80" 
                  value={setpoint} 
                  onChange={(e) => setSetpoint(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>65°F</span>
                  <span>80°F</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-colors mt-4">
              Reset to Current State
            </button>
          </div>

          {/* Visual Output */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden h-80 flex flex-col items-center justify-center">
              {/* Abstract representation of a building/home */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" 
                   style={{ 
                     background: `radial-gradient(circle at center, ${insulation > 70 ? '#3b82f6' : '#ef4444'} 0%, transparent 70%)` 
                   }} 
              />
              
              <MonitorPlay className="w-24 h-24 text-slate-700 mb-6" />
              <div className="text-center z-10">
                <p className="text-slate-400 mb-2">Simulated Monthly Energy Cost</p>
                <p className="text-6xl font-bold text-white">${currentCost.toFixed(0)}</p>
                
                {currentCost < baseCost && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full font-bold">
                    <TrendingDown className="w-4 h-4" />
                    Saving ${(baseCost - currentCost).toFixed(0)} / mo
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Estimated Upgrade Cost</h3>
                  <p className="text-2xl font-bold text-white">
                    ${((insulation > 50 ? 2000 : 0) + (hvacEfficiency > 70 ? 8000 : 0)).toLocaleString()}
                  </p>
               </div>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">ROI Timeframe</h3>
                  <p className="text-2xl font-bold text-white">
                    {currentCost < baseCost ? ((insulation > 50 ? 2000 : 0) + (hvacEfficiency > 70 ? 8000 : 0)) / (baseCost - currentCost) / 12 > 0 ? (((insulation > 50 ? 2000 : 0) + (hvacEfficiency > 70 ? 8000 : 0)) / (baseCost - currentCost) / 12).toFixed(1) + ' Years' : 'Immediate' : 'N/A'}
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
