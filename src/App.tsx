import { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './lib/supabase';
import { getCurrentUser, signOut } from './lib/auth';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import WasteScanner from './components/WasteScanner';
import WasteTypes from './components/WasteTypes';
import ScanHistory from './components/ScanHistory';
import Leaderboard from './components/Leaderboard';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import EcoTips from './components/EcoTips';
import EcoChatAssistant from './components/chat/EcoChatAssistant';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    async function initAuth() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }

    const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    subscription = sub;

    initAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-200 dark:border-green-900 border-t-green-600 dark:border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (showDashboard && user) {
    return (
      <div className="min-h-screen bg-green-50 dark:bg-gray-950">
        <Navbar
          layout="surface"
          user={user}
          onAuthClick={() => setShowAuth(true)}
          onTipsClick={() => setShowTips(true)}
          onDashboardClick={() => setShowDashboard(false)}
          onSignOut={async () => {
            await signOut();
            setUser(null);
            setShowDashboard(false);
          }}
        />
        <div className="pt-16">
          <Dashboard
            user={user}
            onSignOut={async () => {
              await signOut();
              setUser(null);
              setShowDashboard(false);
            }}
          />
        </div>
        {showTips && <EcoTips onClose={() => setShowTips(false)} />}
        {showAuth && <Auth onClose={() => setShowAuth(false)} onAuthSuccess={() => setShowAuth(false)} />}
        <EcoChatAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-950">
      <Navbar
        user={user}
        onAuthClick={() => setShowAuth(true)}
        onTipsClick={() => setShowTips(true)}
        onDashboardClick={() => setShowDashboard(true)}
      />
      <Hero />
      <HowItWorks />
      <WasteScanner user={user} />
      <WasteTypes />
      <ScanHistory />
      <Leaderboard />
      <Footer />

      {showAuth && <Auth onClose={() => setShowAuth(false)} onAuthSuccess={() => {
        setShowAuth(false);
        setShowDashboard(true);
      }} />}
      {showTips && <EcoTips onClose={() => setShowTips(false)} />}
      <EcoChatAssistant />
    </div>
  );
}
