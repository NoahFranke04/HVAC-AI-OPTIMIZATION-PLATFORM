import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Home, Save, CheckCircle2, AlertCircle, Zap, FastForward, Settings2, Camera, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from './SubscriptionProvider';

export default function HomeProfile({ user }: { user: User }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const [homeId, setHomeId] = useState<string | null>(null);
  const { isPro, setShowPaywall } = useSubscription();
  const [isScanning, setIsScanning] = useState(false);
  const [formData, setFormData] = useState({
    squareFootage: 2000,
    zipCode: '',
    yearBuilt: 2005,
    // Detailed fields
    insulationLevel: 'average',
    hvacType: 'Central AC + Furnace',
    occupancy: 4,
    windowsType: 'Double Pane',
  });

  useEffect(() => {
    const fetchHome = async () => {
      const q = query(collection(db, 'homes'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const homeDoc = snapshot.docs[0];
        setHomeId(homeDoc.id);
        setFormData(homeDoc.data() as any);
        setMode('detailed'); // If they have data, show detailed
      }
      setLoading(false);
    };
    fetchHome();
  }, [user.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (homeId) {
        await updateDoc(doc(db, 'homes', homeId), {
          ...formData,
          efficiencyScore: Math.floor(Math.random() * 30) + 60
        });
      } else {
        await addDoc(collection(db, 'homes'), {
          ...formData,
          userId: user.uid,
          efficiencyScore: 72
        });
      }
      
      // Navigate to dashboard to show the teaser (or full dashboard for Pro)
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
    } finally {
        setSaving(false);
    }
  };

  const simulateAIScan = () => {
    setIsScanning(true);
    setTimeout(() => {
        setFormData(prev => ({
            ...prev,
            insulationLevel: 'poor',
            hvacType: 'Central AC + Furnace',
            windowsType: 'Single Pane'
        }));
        setIsScanning(false);
        setMode('detailed');
    }, 2500);
  };

  if (loading) return <div className="animate-pulse text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
          Let's calculate your savings
        </h1>
        <p className="text-slate-400 text-lg mb-6">Enter a few details to get your personalized ROI report.</p>
        
        <button 
          onClick={() => {
            setFormData({
              squareFootage: 2500,
              zipCode: '78704',
              yearBuilt: 1995,
              insulationLevel: 'poor',
              hvacType: 'Central AC + Furnace',
              occupancy: 4,
              windowsType: 'Single Pane',
            });
            setMode('detailed');
          }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-2 rounded-full text-sm font-bold transition-colors border border-slate-700"
        >
          Try with a sample home
        </button>
      </header>

      {/* AI Scan Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6 text-blue-400" />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg">AI Property Scan</h3>
                <p className="text-slate-400 text-sm">Upload a photo of your HVAC unit or attic. AI will auto-fill your profile.</p>
            </div>
        </div>
        <button 
            onClick={simulateAIScan}
            disabled={isScanning}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
            {isScanning ? (
                <span className="animate-pulse">Scanning Image...</span>
            ) : (
                <><Upload className="w-4 h-4" /> Upload Photo</>
            )}
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1 rounded-xl inline-flex border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('quick')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              mode === 'quick' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            <FastForward className="w-4 h-4" />
            Quick Estimate (60s)
          </button>
          <button
            type="button"
            onClick={() => setMode('detailed')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              mode === 'detailed' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            )}
          >
            <Settings2 className="w-4 h-4" />
            Detailed Profile
          </button>
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Always show Quick fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Square Footage</label>
                  <input
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => setFormData({ ...formData, squareFootage: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
                    placeholder="e.g. 78701"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Used to fetch local climate data
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Year Built (Approx)</label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
                  />
                </div>
              </div>

              {/* Show Detailed fields if mode is detailed */}
              {mode === 'detailed' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Current HVAC System</label>
                    <select
                      value={formData.hvacType}
                      onChange={(e) => setFormData({ ...formData, hvacType: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option>Central AC + Furnace</option>
                      <option>Heat Pump</option>
                      <option>Mini-Split System</option>
                      <option>Boiler + Radiators</option>
                      <option>Window Units</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Insulation Quality</label>
                    <select
                      value={formData.insulationLevel}
                      onChange={(e) => setFormData({ ...formData, insulationLevel: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="poor">Poor (Drafty, old)</option>
                      <option value="average">Average (Standard)</option>
                      <option value="good">Good (Recently updated)</option>
                      <option value="excellent">Excellent (Energy Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">Occupancy (People)</label>
                    <input
                      type="number"
                      value={formData.occupancy}
                      onChange={(e) => setFormData({ ...formData, occupancy: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-xl",
                  saving ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500 text-white shadow-green-900/20"
                )}
              >
                {saving ? 'Analyzing Data...' : 'Calculate My Savings'}
              </button>
              <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Your data is secure and never sold to third parties.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
