import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';
import type { EcoImpact } from '../types/waste';

interface Props {
  user: any;
  onSignOut: () => void;
}

export default function Dashboard({ user, onSignOut }: Props) {
  const [impact, setImpact] = useState<EcoImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'history' | 'settings'>('overview');

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Fetch eco impact
      const { data: impactData } = await supabase
        .from('eco_impacts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setImpact(impactData);
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    onSignOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-green-200 dark:border-green-900 border-t-green-600 dark:border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Scans', value: impact?.total_scans || 0, icon: '📊' },
    { label: 'CO2 Saved (kg)', value: (impact?.co2_saved || 0).toFixed(1), icon: '💨' },
    { label: 'Water Saved (L)', value: (impact?.water_saved || 0).toFixed(0), icon: '💧' },
    { label: 'Trees Saved', value: (impact?.trees_saved || 0).toFixed(1), icon: '🌳' },
  ];

  const categories = [
    { label: 'Plastic', value: impact?.plastic_items || 0, color: '#FBBF24', icon: '♻' },
    { label: 'Organic', value: impact?.organic_items || 0, color: '#84CC16', icon: '🌱' },
    { label: 'Metal', value: impact?.metal_items || 0, color: '#6B7280', icon: '🥫' },
    { label: 'E-Waste', value: impact?.ewaste_items || 0, color: '#EF4444', icon: '📱' },
    { label: 'Paper', value: impact?.paper_items || 0, color: '#3B82F6', icon: '📄' },
    { label: 'Glass', value: impact?.glass_items || 0, color: '#06B6D4', icon: '🫙' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Your Eco Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-900 rounded-2xl p-1 border border-green-100 dark:border-gray-800 w-fit animate-fade-in-up delay-100">
          {(['overview', 'history', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                tab === t
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-green-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-green-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Items by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((cat) => (
                  <div key={cat.label} className="text-center">
                    <div
                      className="w-full h-16 rounded-xl flex items-center justify-center text-2xl mb-2 shadow-sm"
                      style={{ backgroundColor: cat.color + '22', border: `2px solid ${cat.color}44` }}
                    >
                      {cat.icon}
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">{cat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{cat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Info */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-3">Your Environmental Impact</h3>
              <p className="leading-relaxed">
                By responsibly sorting {impact?.total_scans || 0} items, you've contributed to reducing pollution and preserving natural resources. Keep scanning to increase your positive impact!
              </p>
            </div>
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-green-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Scans</h3>
              <p className="text-gray-500 dark:text-gray-400">Scan history will appear here after your first scan.</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-green-100 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  <span className="text-gray-700 dark:text-gray-300">Receive email updates on eco tips</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  <span className="text-gray-700 dark:text-gray-300">Show my stats on community board</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span className="text-gray-700 dark:text-gray-300">Enable notifications</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-3 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
