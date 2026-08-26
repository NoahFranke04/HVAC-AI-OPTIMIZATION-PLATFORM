import { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lock, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';

type SubscriptionTier = 'free' | 'home' | 'pro' | 'commercial';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isHome: boolean;
  isPro: boolean;
  isCommercial: boolean;
  loading: boolean;
  upgrade: (tier: SubscriptionTier) => Promise<void>;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  stripeCustomerId: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ user, children }: { user: User | null, children: React.ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      setTier('free');
      setStripeCustomerId(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTier(data.subscriptionTier || 'free');
        setStripeCustomerId(data.stripeCustomerId || null);
      } else {
        // Initialize user profile if it doesn't exist
        setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          subscriptionTier: 'free',
          createdAt: serverTimestamp()
        }, { merge: true });
      }
      setLoading(false);
      
      // Check if we need to show the paywall after login
      if (localStorage.getItem('showPaywallAfterLogin') === 'true') {
          setShowPaywall(true);
          localStorage.removeItem('showPaywallAfterLogin');
      }
    });

    return () => unsubscribe();
  }, [user]);

  const upgrade = async (newTier: SubscriptionTier) => {
    if (!user) return;
    setIsProcessing(true);
    
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tier: newTier,
          email: user.email,
          stripeCustomerId: stripeCustomerId
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Failed to start checkout process. Please check configuration.');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
      alert('An error occurred while starting checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutComplete = async () => {
    // This is no longer used for the simulated flow, 
    // but kept here if we need it for something else or can be removed.
  };

  const value = {
    tier,
    isHome: tier === 'home' || tier === 'pro' || tier === 'commercial',
    isPro: tier === 'pro' || tier === 'commercial',
    isCommercial: tier === 'commercial',
    loading,
    upgrade,
    showPaywall,
    setShowPaywall,
    stripeCustomerId
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
      {/* Paywall Modal */}
      {showPaywall && !checkoutTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-4xl w-full shadow-2xl relative my-8">
                <button 
                    onClick={() => setShowPaywall(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    ✕
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Choose Your Optimization Plan</h2>
                    <p className="text-slate-400">Unlock advanced analytics, automation, and predictive maintenance.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Home Plan */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex flex-col">
                        <div className="mb-4">
                            <p className="text-slate-400 font-medium">Home Plan</p>
                            <p className="text-3xl font-bold text-white">$15<span className="text-lg text-slate-500 font-normal">/mo</span></p>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-300 mb-8 flex-1">
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Basic optimization</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Savings insights</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Upgrade recommendations</span></li>
                        </ul>
                        <button 
                            onClick={() => upgrade('home')}
                            disabled={isProcessing}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : 'Select Home'}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/50 flex flex-col relative">
                        <div className="absolute -top-3 inset-x-0 flex justify-center">
                            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                        </div>
                        <div className="mb-4">
                            <p className="text-blue-400 font-medium">Pro Plan</p>
                            <p className="text-3xl font-bold text-white">$29<span className="text-lg text-slate-500 font-normal">/mo</span></p>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-300 mb-8 flex-1">
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Real-time monitoring</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">AI automation & scheduling</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Predictive maintenance</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Interactive Digital Twin</span></li>
                        </ul>
                        <button 
                            onClick={() => upgrade('pro')}
                            disabled={isProcessing}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : 'Select Pro'}
                        </button>
                    </div>

                    {/* Commercial Plan */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 flex flex-col">
                        <div className="mb-4">
                            <p className="text-slate-400 font-medium">Commercial Plan</p>
                            <p className="text-3xl font-bold text-white">$99<span className="text-lg text-slate-500 font-normal">/mo</span></p>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-300 mb-8 flex-1">
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Multi-property management</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Advanced financial analytics (NPV, IRR)</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Reporting tools & exports</span></li>
                            <li className="flex items-start gap-2">✓ <span className="flex-1">Team access controls</span></li>
                        </ul>
                        <button 
                            onClick={() => upgrade('commercial')}
                            disabled={isProcessing}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : 'Select Commercial'}
                        </button>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-6">Cancel anytime. 14-day money-back guarantee.</p>
            </div>
        </div>
      )}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
