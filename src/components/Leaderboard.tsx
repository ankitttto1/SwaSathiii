import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types/waste';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<(UserProfile & { rank: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'scans' | 'impact'>('scans');

  useEffect(() => {
    async function fetchLeaders() {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .order(tab === 'scans' ? 'total_scans' : 'co2_saved', { ascending: false })
        .limit(10);

      if (data) {
        const withRank = data.map((profile: UserProfile, i) => ({
          ...profile,
          rank: i + 1
        }));
        setLeaders(withRank);
      }
      setLoading(false);
    }

    fetchLeaders();
  }, [tab]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
            Community Leaders
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Top Contributors</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Celebrate the community members making the biggest environmental impact.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-green-50 rounded-2xl p-1 w-fit mx-auto">
          {(['scans', 'impact'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                tab === t
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Most {t === 'scans' ? 'Scans' : 'Impact'}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaders.map((leader, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '✨';
            const stat = tab === 'scans' ? leader.total_scans : leader.co2_saved.toFixed(1);
            const unit = tab === 'scans' ? 'scans' : 'kg CO2 saved';

            return (
              <div
                key={leader.id}
                className="bg-white border border-green-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-2xl">{medal}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">#{i + 1}</div>
                  <div className="text-sm text-gray-500">{leader.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-green-600">{stat}</div>
                  <div className="text-xs text-gray-400">{unit}</div>
                </div>
              </div>
            );
          })}
        </div>

        {leaders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Leaderboard coming soon. Be the first to make an impact!</p>
          </div>
        )}
      </div>
    </section>
  );
}
