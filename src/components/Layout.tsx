import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, BarChart3, Lightbulb, Map, ShoppingBag, LogOut, Menu, X, Zap, ShieldCheck, Building2, TrendingUp, MonitorPlay, MessageSquare, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut, User } from 'firebase/auth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useSubscription } from './SubscriptionProvider';

export default function Layout({ user }: { user: User }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { tier, isPro, isCommercial, stripeCustomerId } = useSubscription();
  const isAdmin = user.email === 'NoahFranke04@gmail.com';

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Home Profile', path: '/profile', icon: Home },
    ...(isCommercial ? [{ name: 'Commercial', path: '/commercial', icon: Building2 }] : []),
    { name: 'Analysis', path: '/analysis', icon: BarChart3 },
    { name: 'Financials', path: '/financial', icon: TrendingUp },
    { name: 'Recommendations', path: '/recommendations', icon: Lightbulb },
    { name: 'Digital Twin', path: '/twin', icon: MonitorPlay },
    { name: 'Blueprint Tool', path: '/blueprint', icon: Map },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: ShieldAlert }] : []),
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col min-h-full">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">HVAC AI</span>
          </div>

          <nav className="flex-1 px-4 space-y-1 mb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                >
                  <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500")} />
                  <span className="font-bold">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-slate-800 mt-auto">
            <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-sm font-bold text-white border border-slate-600">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.email?.split('@')[0]}</p>
                  <div className="flex items-center gap-1">
                    {isPro ? <ShieldCheck className="w-3 h-3 text-blue-400" /> : <Zap className="w-3 h-3 text-slate-500" />}
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest", isPro ? "text-blue-400" : "text-slate-500")}>
                      {tier} Plan
                    </p>
                  </div>
                </div>
              </div>
              {!isCommercial && (
                <Link 
                  to="/dashboard"
                  className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors mb-2"
                >
                  Upgrade Plan
                </Link>
              )}
              {tier !== 'free' && (
                <button 
                  onClick={async () => {
                    try {
                      if (!stripeCustomerId) {
                        alert("No active Stripe subscription found.");
                        return;
                      }
                      const token = await user.getIdToken();
                      const res = await fetch('/api/create-portal-session', {
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ customerId: stripeCustomerId })
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="w-full block text-center bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                >
                  Manage Subscription
                </button>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:bg-slate-800 hover:text-red-400 rounded-xl transition-all group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        <header className="h-20 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-white lg:hidden"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              System Optimized
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-xs font-bold text-slate-500">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
