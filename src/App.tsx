import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from './lib/firebase';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HomeProfile from './components/HomeProfile';
import Analysis from './components/Analysis';
import Recommendations from './components/Recommendations';
import Marketplace from './components/Marketplace';
import Auth from './components/Auth';
import BlueprintTool from './components/BlueprintTool';
import CommercialDashboard from './components/CommercialDashboard';
import FinancialAnalytics from './components/FinancialAnalytics';
import DigitalTwin from './components/DigitalTwin';
import AIAssistant from './components/AIAssistant';

import { SubscriptionProvider } from './components/SubscriptionProvider';
import LandingPage from './components/LandingPage';

import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-pulse text-xl font-medium">Initializing HVAC AI...</div>
      </div>
    );
  }

  const isAdmin = user?.email === 'NoahFranke04@gmail.com';

  return (
    <SubscriptionProvider user={user}>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
          
          {user && (
            <Route element={<Layout user={user} />}>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/profile" element={<HomeProfile user={user} />} />
              <Route path="/commercial" element={<CommercialDashboard />} />
              <Route path="/analysis" element={<Analysis user={user} />} />
              <Route path="/financial" element={<FinancialAnalytics />} />
              <Route path="/recommendations" element={<Recommendations user={user} />} />
              <Route path="/twin" element={<DigitalTwin />} />
              <Route path="/blueprint" element={<BlueprintTool user={user} />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/assistant" element={<AIAssistant user={user} />} />
              {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SubscriptionProvider>
  );
}
