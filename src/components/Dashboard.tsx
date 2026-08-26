import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, onSnapshot, limit, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, DollarSign, TrendingDown, AlertTriangle, CheckCircle2, Info, Lightbulb, ArrowUpRight, Lock, ShieldCheck, Activity, Share2, Users, CloudRain, Power } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useSubscription } from './SubscriptionProvider';
import { trackEvent } from '../lib/analytics';
import { Link } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500; // 1.5s
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>${displayValue.toLocaleString()}</span>;
};

const generateMockEnergyData = (home: any) => {
  const baseUsage = (home?.squareFootage || 2000) / 100;
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const tempFactor = hour > 12 && hour < 20 ? 1.5 : 0.8; // Peak hours
    const usage = (baseUsage * tempFactor * (0.8 + Math.random() * 0.4)).toFixed(2);
    return {
      name: `${hour}:00`,
      usage: parseFloat(usage),
      cost: parseFloat((parseFloat(usage) * 0.14).toFixed(2))
    };
  });
};

export default function Dashboard({ user }: { user: User }) {
  const { tier, isPro, upgrade, setShowPaywall } = useSubscription();
  const [home, setHome] = useState<any>(null);
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);

  useEffect(() => {
    trackEvent('view_dashboard');
    
    // Check for Stripe checkout success
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      // You could also show a success toast here
      console.log('Checkout successful, session ID:', sessionId);
    }

    const q = query(collection(db, 'homes'), where('userId', '==', user.uid), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const homeDoc = snapshot.docs[0];
        const homeData = { id: homeDoc.id, ...homeDoc.data() };
        setHome(homeData);
        
        if (isPro) {
          setEnergyData(generateMockEnergyData(homeData));
        } else {
            // Generate some data even for free tier to show blurred chart
            setEnergyData(generateMockEnergyData(homeData));
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.uid, isPro]);

  const handleShare = async () => {
    const shareText = `I can save $${potentialSavings}/yr on my energy bill using HVAC AI! Check it out:`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My HVAC Savings',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const toggleAutoOptimize = () => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    setAutoOptimize(!autoOptimize);
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading dashboard...</div>;

  if (!home) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Welcome to HVAC AI</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">To calculate your potential savings, we need a few basic details about your home.</p>
        <Link to="/profile" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 inline-flex items-center gap-2">
          Start Quick Estimate <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const potentialSavings = home.squareFootage ? home.squareFootage * 0.64 : 1284; // Simulated calculation

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Your home energy overview.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={handleShare}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all border border-slate-700 flex items-center gap-2"
            >
                <Share2 className="w-4 h-4" /> {shareCopied ? 'Copied!' : 'Share'}
            </button>
            {!isPro && (
            <button onClick={() => setShowPaywall(true)} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 border border-blue-400/30">
                <Lock className="w-4 h-4" /> Unlock Full Report
            </button>
            )}
        </div>
      </header>

      {/* Primary Savings Metric */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-900/40 to-slate-900 border border-green-500/30 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10 text-center">
          <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-4 flex items-center justify-center gap-2">
            <DollarSign className="w-4 h-4" /> Potential Annual Savings
          </p>
          <h2 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter">
            <AnimatedCounter value={potentialSavings} />
            <span className="text-3xl md:text-4xl text-slate-500 font-bold">/yr</span>
          </h2>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-bold text-sm">You are losing ~${Math.round(potentialSavings / 12)} every month</span>
          </div>

          {!isPro ? (
            <div className="inline-flex flex-col items-center">
              <p className="text-slate-400 mb-6 max-w-lg mx-auto text-lg">
                Our AI has identified significant inefficiencies in your HVAC setup. Unlock the Pro report to see exactly how to claim these savings.
              </p>
              <button onClick={() => setShowPaywall(true)} className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-green-900/20 flex items-center gap-2">
                Unlock Step-by-Step Plan <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${autoOptimize ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                  <Power className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold">Auto Optimize Mode</p>
                  <p className="text-slate-400 text-xs">AI adjusts thermostat based on weather & pricing</p>
                </div>
                <button 
                  onClick={toggleAutoOptimize}
                  className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoOptimize ? 'bg-blue-600' : 'bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoOptimize ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <CloudRain className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold">Grid Intelligence</p>
                  <p className="text-slate-400 text-xs">Shift cooling by 2 hours → save 18% today</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Efficiency Score */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden shadow-lg">
          <h3 className="text-slate-400 font-medium mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            System Efficiency
          </h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-white">{home.efficiencyScore || 72}</span>
            <span className="text-slate-500 mb-1">/ 100</span>
          </div>
          <div className="mt-6 w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-1000" 
              style={{ width: `${home.efficiencyScore || 72}%` }}
            />
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
             <h4 className="text-sm font-medium text-slate-400 mb-3">Compare with Neighbors</h4>
             <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-500">Your Area Avg.</span>
                 <span className="text-white font-bold">65 / 100</span>
             </div>
             <div className="flex items-center justify-between text-sm mt-2">
                 <span className="text-slate-500">Top 10%</span>
                 <span className="text-green-400 font-bold">88 / 100</span>
             </div>
          </div>
        </div>

        {/* Real-time Usage Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-slate-400 font-medium flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              24h Energy Load
            </h3>
            {!isPro && (
              <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Pro Feature
              </span>
            )}
          </div>
          
          <div className={cn("h-[200px] w-full", !isPro && "blur-sm opacity-50 pointer-events-none")}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}kW`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {!isPro && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 z-10">
              <button onClick={() => setShowPaywall(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-xl flex items-center gap-2">
                <Lock className="w-4 h-4" /> Unlock Live Monitoring
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Insights & Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Predictive Failure Alert */}
            {isPro && (
                <div className="bg-red-950/30 border border-red-500/30 p-6 rounded-2xl flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-red-400 font-bold text-lg mb-1">Predictive Failure Warning</h3>
                        <p className="text-slate-300 text-sm mb-3">
                            <strong className="text-white">Estimated failure risk: 72% within 6 months.</strong> 
                            Your compressor is showing signs of degradation based on runtime cycles.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1 rounded-full">
                                Avoid $6,500 repair cost
                            </span>
                            <Link to="/marketplace" className="text-sm font-bold text-white hover:text-red-300 underline">
                                Schedule Maintenance Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-lg">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                AI Insights Center
                </h2>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">3 New Insights</span>
            </div>
            <div className="space-y-4">
                {[
                { title: 'Peak Usage Detected', desc: 'Your HVAC usage spikes between 4 PM and 7 PM. Consider pre-cooling your home.', type: 'warning' },
                { title: 'Efficiency Milestone', desc: 'Your new insulation has reduced cooling loss by 12% this week.', type: 'success' },
                { title: 'Maintenance Alert', desc: 'System performance indicates a potential filter clog. Check your furnace filter.', type: 'alert' },
                ].map((insight, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-5 bg-slate-800/30 rounded-2xl border border-slate-800/50 hover:bg-slate-800/50 transition-colors"
                >
                    <div className={cn(
                    "p-2.5 h-fit rounded-xl",
                    insight.type === 'warning' ? 'bg-yellow-400/10 text-yellow-400' :
                    insight.type === 'success' ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'
                    )}>
                    {insight.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                    insight.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div>
                    <h3 className="text-white font-bold text-base">{insight.title}</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">{insight.desc}</p>
                    </div>
                </motion.div>
                ))}
            </div>
            </div>
        </div>

        <div className="space-y-8">
            {!isPro && (
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40 flex flex-col justify-center">
                <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 leading-tight">Secure Your Savings</h2>
                    <p className="text-blue-100 mb-6 text-sm leading-relaxed flex-1">
                    Unlock predictive failure detection and advanced digital twin simulations to maximize your ROI.
                    </p>
                    <button 
                    onClick={() => setShowPaywall(true)}
                    className="w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
                    >
                    Upgrade to Pro
                    </button>
                </div>
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-400 rounded-full blur-[80px] opacity-30" />
                </div>
            )}

            {/* Referral Card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-lg">
                <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Invite a Friend</h3>
                <p className="text-slate-400 text-sm mb-6">Give a friend a free home analysis and get 1 month of Pro for free when they upgrade.</p>
                <button 
                    onClick={handleShare}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
                >
                    <Share2 className="w-4 h-4" /> {shareCopied ? 'Link Copied!' : 'Share Invite Link'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
