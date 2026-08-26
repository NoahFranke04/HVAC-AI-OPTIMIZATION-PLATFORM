import { ShoppingBag, Star, ShieldCheck, MapPin, Phone, ExternalLink, Award, Loader2, CheckCircle2, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { trackEvent } from '../lib/analytics';
import { cn } from '../lib/utils';
import { useSubscription } from './SubscriptionProvider';

const contractors = [
  {
    id: 'eco-air',
    name: 'EcoAir Solutions',
    rating: 4.9,
    reviews: 128,
    specialty: 'High-Efficiency Heat Pumps',
    location: 'Austin, TX',
    verified: true,
    commercial: true,
    image: 'https://picsum.photos/seed/hvac1/400/300'
  },
  {
    id: 'precision',
    name: 'Precision HVAC',
    rating: 4.7,
    reviews: 85,
    specialty: 'Smart Thermostat Integration',
    location: 'Round Rock, TX',
    verified: true,
    commercial: false,
    image: 'https://picsum.photos/seed/hvac2/400/300'
  },
  {
    id: 'green-flow',
    name: 'GreenFlow Mechanical',
    rating: 4.8,
    reviews: 210,
    specialty: 'Energy Audits & Insulation',
    location: 'Cedar Park, TX',
    verified: true,
    commercial: true,
    image: 'https://picsum.photos/seed/hvac3/400/300'
  }
];

export default function Marketplace() {
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const { isPro, isCommercial, setShowPaywall } = useSubscription();

  const handleRequestQuote = async (contractor: any) => {
    if (!isPro && !isCommercial) {
        setShowPaywall(true);
        return;
    }
    
    const user = auth.currentUser;
    if (!user) return;

    setRequestingId(contractor.id);
    trackEvent('request_quote', { contractorName: contractor.name });

    try {
      await addDoc(collection(db, 'leads'), {
        userId: user.uid,
        contractorName: contractor.name,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccessId(contractor.id);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Contractor Ecosystem
            <ShoppingBag className="w-7 h-7 text-blue-500" />
          </h1>
          <p className="text-slate-400 mt-1">Connect with verified HVAC professionals to implement your AI recommendations.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-300">Austin, TX</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contractors.map((contractor, i) => (
          <motion.div
            key={contractor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl group hover:border-blue-500/50 transition-all flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={contractor.image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={contractor.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {contractor.verified && (
                  <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg w-fit">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED
                  </div>
                )}
                {contractor.commercial && (
                  <div className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg w-fit">
                    <Briefcase className="w-3 h-3" />
                    COMMERCIAL
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{contractor.name}</h3>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold">{contractor.rating}</span>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6 flex-1">{contractor.specialty}</p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="p-1.5 bg-slate-800 rounded-lg">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  {contractor.location}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="p-1.5 bg-slate-800 rounded-lg">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  Licensed & Insured
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button 
                  onClick={() => handleRequestQuote(contractor)}
                  disabled={requestingId === contractor.id || successId === contractor.id}
                  className={cn(
                    "flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-all shadow-lg text-sm",
                    successId === contractor.id ? "bg-green-500 text-white" :
                    "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  )}
                >
                  {requestingId === contractor.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                   successId === contractor.id ? <CheckCircle2 className="w-4 h-4" /> : null}
                  {requestingId === contractor.id ? 'Sending...' : 
                   successId === contractor.id ? 'Requested!' : 'Get Quote'}
                </button>
                <button 
                  onClick={() => handleRequestQuote(contractor)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 text-sm"
                >
                  Hire Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-12 rounded-[2.5rem] text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Are you a contractor?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Join our network of energy-efficient HVAC professionals. Get matched with high-intent homeowners and commercial clients looking for upgrades.
          </p>
          <button className="bg-white text-slate-900 font-bold px-10 py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-xl">
            Join the Partner Network
          </button>
        </div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
