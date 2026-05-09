import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { wasteData } from '../lib/wasteData';
import type { ScanRecord, WasteCategory } from '../types/waste';

const categories: WasteCategory[] = ['plastic', 'organic', 'metal', 'ewaste', 'paper', 'glass'];

export default function ScanHistory() {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WasteCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      const { data } = await supabase
        .from('scan_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setRecords(data as ScanRecord[]);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = records;

    if (filter !== 'all') {
      filtered = filtered.filter(r => r.category === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(r => {
        const data = wasteData[r.category as WasteCategory];
        return data.label.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredRecords(filtered);
  }, [records, filter, searchTerm]);

  if (loading) {
    return (
      <section id="history" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-2xl shimmer" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (records.length === 0) return null;

  return (
    <section id="history" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
            Recent Scans
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Scan History</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Search and filter your waste classifications.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search by waste type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const data = wasteData[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    filter === cat
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: filter === cat ? data.binColor : undefined,
                  }}
                >
                  <span>{data.icon}</span>
                  {data.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No scans found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredRecords.map((record) => {
              const data = wasteData[record.category as WasteCategory] || wasteData.unknown;
              const date = new Date(record.created_at);
              return (
                <div
                  key={record.id}
                  className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-2 shadow-sm"
                    style={{ backgroundColor: data.binColor + '22', border: `2px solid ${data.binColor}44` }}
                  >
                    {data.icon}
                  </div>
                  <div className="text-sm font-bold text-gray-800">{data.label}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {Math.round(record.confidence * 100)}% match
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    {date.toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="mt-10 pt-8 border-t border-green-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-green-600">{records.length}</div>
            <div className="text-sm text-gray-500">Total Scans</div>
          </div>
          {categories.map((cat) => {
            const count = records.filter(r => r.category === cat).length;
            return (
              <div key={cat} className="text-center">
                <div className="text-2xl font-extrabold text-gray-800">{count}</div>
                <div className="text-sm text-gray-500">{wasteData[cat].label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
