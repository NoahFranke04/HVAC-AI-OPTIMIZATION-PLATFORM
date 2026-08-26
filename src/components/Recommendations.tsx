import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getHvacRecommendations } from '../lib/gemini';
import { Lightbulb, TrendingUp, Clock, DollarSign, Sparkles, RefreshCw, CheckCircle2, ChevronDown, ChevronUp, Info, ShieldCheck, Lock, ArrowUpRight, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSubscription } from './SubscriptionProvider';
import { trackEvent } from '../lib/analytics';
import { useNavigate } from 'react-router-dom';

export default function Recommendations({ user }: { user: User }) {
  const { isPro, isCommercial, upgrade, setShowPaywall } = useSubscription();
  const navigate = useNavigate();
  const [home, setHome] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [planningId, setPlanningId] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('view_recommendations');
    const fetchHome = async () => {
      const q = query(collection(db, 'homes'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const homeDoc = snapshot.docs[0];
        setHome({ id: homeDoc.id, ...homeDoc.data() });
        
        const rq = query(collection(db, `homes/${homeDoc.id}/recommendations`));
        onSnapshot(rq, (rSnapshot) => {
          setRecommendations(rSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    };
    fetchHome();
  }, [user.uid]);

  const generateNewRecommendations = async () => {
    if (!home) return;
    setGenerating(true);
    trackEvent('generate_recommendations');
    try {
      const newRecs = await getHvacRecommendations(home);
      for (const rec of newRecs) {
        await addDoc(collection(db, `homes/${home.id}/recommendations`), {
          ...rec,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleImplementNow = () => {
      if (!isPro && !isCommercial) {
          setShowPaywall(true);
      } else {
          navigate('/marketplace');
      }
  };

  const handlePlanProject = (recId: string) => {
      if (!isPro && !isCommercial) {
          setShowPaywall(true);
      } else {
          setPlanningId(planningId === recId ? null : recId);
      }
  };

  if (loading) return <div className="animate-pulse text-slate-500">Analyzing home profile...</div>;

  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + (rec.estimatedSavings || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            AI Recommendations
            <Sparkles className="w-6 h-6 text-blue-400" />
          </h1>
          <p className="text-slate-400 mt-1">Expert-level HVAC optimization tailored to your home.</p>
        </div>
        <div className="flex items-center gap-4">
          {!isPro && !isCommercial && (
            <button onClick={() => setShowPaywall(true)} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 border border-blue-400/30">
              <Lock className="w-4 h-4" /> Unlock Full Report
            </button>
          )}
          <button
            onClick={generateNewRecommendations}
            disabled={generating}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
              generating ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-slate-800 hover:bg-slate-700 text-white shadow-slate-900/20"
            )}
          >
            <RefreshCw className={cn("w-5 h-5", generating && "animate-spin")} />
            {generating ? 'AI Reasoning...' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Total Potential Savings Summary */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-900/40 to-slate-900 border border-green-500/30 p-6 rounded-2xl flex items-center justify-between shadow-lg"
        >
          <div>
            <p className="text-green-400 font-bold uppercase tracking-widest text-xs mb-1">Total Potential Savings</p>
            <h2 className="text-4xl font-black text-white">${totalPotentialSavings}<span className="text-xl text-slate-500 font-bold">/yr</span></h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-slate-400 text-sm">Implement these {recommendations.length} recommendations</p>
            <p className="text-slate-400 text-sm">to maximize your home's efficiency.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.id || i}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-lg hover:border-slate-700 transition-colors group"
            >
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "px-3 py-1 text-[10px] font-bold rounded-md border uppercase tracking-widest",
                        rec.priority === 1 ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        rec.priority === 2 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      )}>
                        Priority {rec.priority}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-md">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        {Math.round(rec.confidence * 100)}% Confidence
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{rec.title}</h3>
                    <p className="text-slate-400 leading-relaxed max-w-3xl">{rec.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:w-56 shrink-0">
                    <div className="bg-gradient-to-br from-green-900/20 to-slate-800/50 p-5 rounded-2xl border border-green-500/20">
                      <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Est. Savings</p>
                      <div className="flex items-center gap-1 text-white text-2xl font-black">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        {rec.estimatedSavings}<span className="text-sm text-slate-500 font-bold">/yr</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Payback Period</p>
                      <div className="flex items-center gap-2 text-white text-xl font-bold">
                        <Clock className="w-5 h-5 text-blue-400" />
                        {rec.roi} Years
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors w-fit"
                      >
                        {expandedId === rec.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expandedId === rec.id ? 'Hide Reasoning' : 'How we calculate this'}
                      </button>
                      <button 
                        onClick={() => handlePlanProject(rec.id)}
                        className="flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors w-fit"
                      >
                        <CalendarDays className="w-4 h-4" />
                        Plan Project
                      </button>
                  </div>
                  <button 
                    onClick={handleImplementNow}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Implement Now <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence>
                  {expandedId === rec.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-8 p-8 bg-slate-800/50 rounded-2xl border border-slate-700 relative">
                        {!isPro && !isCommercial && (
                          <div className="absolute inset-0 backdrop-blur-md bg-slate-900/60 flex flex-col items-center justify-center p-6 text-center z-10 rounded-2xl">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                              <Lock className="w-6 h-6 text-blue-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Detailed AI Reasoning Locked</h4>
                            <p className="text-slate-400 text-sm max-w-md mb-6">Upgrade to Pro to see exactly how our AI calculated these savings and get a step-by-step implementation guide.</p>
                            <button 
                              onClick={() => setShowPaywall(true)}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-900/20"
                            >
                              Unlock Pro Insights
                            </button>
                          </div>
                        )}
                        <div className={cn("flex gap-4", !isPro && !isCommercial && "opacity-30 blur-sm pointer-events-none")}>
                          <div className="p-3 bg-blue-500/10 rounded-xl h-fit">
                            <Info className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg mb-2">AI Reasoning</h4>
                            <p className="text-slate-400 text-base leading-relaxed">{rec.reasoning}</p>
                            
                            {/* Placeholder for more detailed breakdown if available in data */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Data Sources</p>
                                    <p className="text-sm text-slate-300">EIA.gov averages, Local Weather Data, System Specs</p>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Calculation Model</p>
                                    <p className="text-sm text-slate-300">Degree-day analysis + Equipment efficiency curve</p>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {planningId === rec.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-8 p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
                          <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                              <CalendarDays className="w-5 h-5 text-purple-400" />
                              Project Plan: {rec.title}
                          </h4>
                          <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
                                  <div>
                                      <p className="text-white font-bold">Initial Assessment</p>
                                      <p className="text-slate-400 text-sm">Schedule a contractor to verify current system state and confirm AI estimates.</p>
                                  </div>
                              </div>
                              <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
                                  <div>
                                      <p className="text-white font-bold">Procurement & Scheduling</p>
                                      <p className="text-slate-400 text-sm">Order necessary equipment and schedule installation dates (typically 2-4 weeks lead time).</p>
                                  </div>
                              </div>
                              <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
                                  <div>
                                      <p className="text-white font-bold">Installation & Verification</p>
                                      <p className="text-slate-400 text-sm">Complete installation and run post-install diagnostics to ensure optimal performance.</p>
                                  </div>
                              </div>
                          </div>
                          <div className="mt-6 flex justify-end">
                              <button onClick={() => handleImplementNow()} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-purple-900/20">
                                  Start Phase 1
                              </button>
                          </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
