import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Zap, BarChart3, ShieldCheck, DollarSign, Clock, Users, Star, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">HVAC AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#trust" className="hover:text-white transition-colors">Our Data</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/auth" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20">
              Analyze My Home Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold mb-8">
              <DollarSign className="w-4 h-4" />
              AVERAGE USER SAVES $850/YEAR
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
              Stop overpaying on energy—see exactly how much you can save
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Find out exactly how much money you are losing to HVAC inefficiencies, and get a step-by-step plan to fix it. Takes 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 group"
              >
                Analyze My Home Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-slate-500 sm:hidden">No credit card required</p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 60-second setup</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Instant ROI report</div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works in 3 simple steps</h2>
            <p className="text-slate-400">From data entry to actionable savings in under a minute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Quick Estimate', desc: 'Enter your square footage, ZIP code, and home age. We use local climate data to build a baseline.' },
              { step: '02', title: 'AI Analysis', desc: 'Our engineering models simulate your HVAC load and identify exact areas of energy waste.' },
              { step: '03', title: 'See Your Savings', desc: 'Get a prioritized list of upgrades, showing exactly how much you will save and the payback period.' },
            ].map((item, i) => (
              <div key={item.step} className="relative p-8 bg-slate-900 border border-slate-800 rounded-3xl">
                <div className="text-5xl font-black text-slate-800 mb-6">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Cost of Doing Nothing</h2>
            <p className="text-slate-400">See the difference optimization makes over a 10-year period.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-950/20 border border-red-500/20 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">Before</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Standard Home</h3>
              <p className="text-slate-400 mb-6">Old equipment, poor insulation, no smart controls.</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-slate-300">Monthly Energy Bill</span>
                  <span className="text-xl font-bold text-red-400">$285</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-slate-300">10-Year Energy Cost</span>
                  <span className="text-xl font-bold text-red-400">$34,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Unexpected Repairs</span>
                  <span className="text-xl font-bold text-red-400">~$4,500</span>
                </div>
              </div>
            </div>

            <div className="bg-green-950/20 border border-green-500/30 p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-green-900/10">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">After HVAC AI</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Optimized Home</h3>
              <p className="text-slate-400 mb-6">High-efficiency system, smart scheduling, sealed envelope.</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-slate-300">Monthly Energy Bill</span>
                  <span className="text-xl font-bold text-green-400">$165</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-slate-300">10-Year Energy Cost</span>
                  <span className="text-xl font-bold text-green-400">$19,800</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Unexpected Repairs</span>
                  <span className="text-xl font-bold text-green-400">Minimal</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-green-500/20 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total 10-Year Savings</p>
                <p className="text-4xl font-black text-white">$18,900</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Data */}
      <section id="trust" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                <ShieldCheck className="w-4 h-4" />
                ENGINEERING-GRADE ACCURACY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Backed by real HVAC principles and data modeling
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                We don't just guess. Our AI combines your home's physical characteristics with local weather patterns and current energy rates to provide realistic, achievable savings estimates.
              </p>
              <ul className="space-y-4">
                {[
                  'Local climate history integration',
                  'Manual J load calculation principles',
                  'Real-time energy pricing data',
                  'Conservative ROI estimates'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Confidence Score</p>
                    <p className="text-3xl font-bold text-green-400">94%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Data Sources</p>
                    <p className="text-lg font-bold text-white">Verified</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Weather Data</span>
                    <span className="text-white font-medium">NOAA API</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Energy Rates</span>
                    <span className="text-white font-medium">EIA.gov Averages</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Equipment Costs</span>
                    <span className="text-white font-medium">Market Aggregation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Real savings for real homeowners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah J.', location: 'Austin, TX', savings: '$1,240/yr', text: 'I thought my bills were normal for Texas. The AI showed me my ductwork was the issue. Fixed it and saw immediate drops in my bill.' },
              { name: 'Michael T.', location: 'Denver, CO', savings: '$890/yr', text: 'The ROI calculator helped me decide between a standard furnace and a heat pump. The data was spot on.' },
              { name: 'David L.', location: 'Phoenix, AZ', savings: '$1,500/yr', text: 'Best $15 I ever spent. The Pro report gave me the exact specs I needed to negotiate with contractors.' }
            ].map((t, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Saved</p>
                    <p className="font-bold text-green-400">{t.savings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start for free, upgrade when you're ready to see the full breakdown.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
              <h3 className="text-2xl font-bold text-white mb-2">Basic Analysis</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">$0</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">Perfect for getting a quick estimate of your potential savings.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Total potential savings estimate</li>
                <li className="flex items-center gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-5 h-5 text-slate-600" /> Basic home profile</li>
                <li className="flex items-center gap-3 text-slate-500 text-sm"><Lock className="w-5 h-5" /> Detailed ROI breakdown</li>
                <li className="flex items-center gap-3 text-slate-500 text-sm"><Lock className="w-5 h-5" /> Specific AI recommendations</li>
              </ul>
              <Link to="/auth" className="block w-full py-3 px-6 text-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
                Get Free Estimate
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-blue-900/40 to-slate-900 border border-blue-500/30 p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
              <div className="absolute top-6 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro Report</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">$15</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-blue-200 text-sm mb-8">The complete breakdown you need to make smart upgrade decisions.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Everything in Free</li>
                <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Exact ROI timelines</li>
                <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Step-by-step AI recommendations</li>
                <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Real-time energy tracking</li>
                <li className="flex items-center gap-3 text-white text-sm"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Blueprint analysis tool</li>
              </ul>
              <button onClick={() => navigate('/auth?upgrade=true')} className="block w-full py-3 px-6 text-center bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20">
                Unlock Full Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-blue-600 rounded-[2.5rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/40">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Stop overpaying for heating and cooling.</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Takes 60 seconds. See your potential savings immediately.</p>
              <Link
                to="/auth"
                className="inline-flex px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl"
              >
                Analyze My Home Free
              </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-50" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-400 rounded-full blur-[100px] opacity-30" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">HVAC AI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 HVAC AI Optimization Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

