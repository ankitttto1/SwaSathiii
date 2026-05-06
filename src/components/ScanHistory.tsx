import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { wasteData } from '../lib/wasteData';
import type { ScanRecord, WasteCategory } from '../types/waste';

export default function ScanHistory() {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data } = await supabase
        .from('scan_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setRecords(data as ScanRecord[]);
      setLoading(false);
    }
    fetchHistory();
  }, []);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
            Recent Scans
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Scan History</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Your recent waste classifications.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {records.map((record) => {
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
      </div>
    </section>
  );
}
