import type { WasteResult } from '../types/waste';

interface Props {
  result: WasteResult;
  onReset: () => void;
}

export default function ResultCard({ result, onReset }: Props) {
  const confidenceColor =
    result.confidence >= 0.8 ? 'text-green-700 dark:text-green-300' :
    result.confidence >= 0.5 ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-600 dark:text-red-300';

  const confidenceBg =
    result.confidence >= 0.8 ? 'bg-green-100 dark:bg-green-950/70' :
    result.confidence >= 0.5 ? 'bg-yellow-100 dark:bg-yellow-950/50' : 'bg-red-100 dark:bg-red-950/60';

  return (
    <div className="animate-scale-in">
      {/* Header Card */}
      <div
        className="rounded-2xl p-6 mb-4 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${result.binColor}dd, ${result.binColor}99)` }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
          style={{ background: result.binColor, transform: 'translate(30%, -30%)' }} />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow">
              {result.icon}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-0.5">
                Detected Waste
              </div>
              <h3 className="text-2xl font-extrabold">{result.label}</h3>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-sm font-bold ${confidenceBg} ${confidenceColor}`}>
            {Math.round(result.confidence * 100)}% match
          </div>
        </div>

        {/* Bin indicator */}
        <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl">🗑️</div>
          <div>
            <div className="text-xs opacity-80 font-medium">Place in</div>
            <div className="font-bold text-sm">{result.binLabel}</div>
          </div>
          <div className="ml-auto flex gap-1.5">
            {result.recyclable && (
              <span className="px-2 py-0.5 bg-white/25 rounded-full text-xs font-semibold">Recyclable</span>
            )}
            {result.hazardous && (
              <span className="px-2 py-0.5 bg-red-500/40 rounded-full text-xs font-semibold">Hazardous</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-4 border border-green-100 dark:border-gray-800 shadow-sm">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2 flex items-center gap-2">
          <span className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-xs">i</span>
          About this waste
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{result.description}</p>
      </div>

      {/* Recycling Tips */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-5 border border-green-100 dark:border-gray-800 shadow-sm">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="text-green-500 dark:text-green-400">♻</span>
          Recycling Tips
        </h4>
        <ul className="space-y-2.5">
          {result.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: result.binColor }}
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bin Color Visual */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-5 border border-green-100 dark:border-gray-800 shadow-sm">
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2">
          <span className="text-green-500 dark:text-green-400">🗑</span>
          Correct Bin
        </h4>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div
              className="w-20 h-24 rounded-b-xl rounded-t-sm mx-auto mb-2 shadow-inner flex items-end justify-center pb-2 relative"
              style={{ backgroundColor: result.binColor }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-4 rounded-t-sm opacity-50"
                style={{ backgroundColor: result.binColor }}
              />
              <span className="text-white text-2xl">♻</span>
            </div>
            <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{result.label}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{result.binLabel}</div>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-2xl transition-all duration-150 shadow-md shadow-green-200 dark:shadow-green-950/80"
      >
        Scan Another Item
      </button>
    </div>
  );
}
