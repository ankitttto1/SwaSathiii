import { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function EcoTips({ onClose }: Props) {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      icon: '♻️',
      title: 'The 3 R Rule',
      description: 'Reduce, Reuse, Recycle. First try to reduce consumption, then reuse items when possible, and finally recycle what you cannot reuse.',
      fact: '75% of all waste can be recycled, but only 32% actually is.'
    },
    {
      icon: '🌍',
      title: 'Plastic Pollution',
      description: 'Every minute, 1 million plastic bottles are sold worldwide. Choosing reusable alternatives can prevent massive ocean pollution.',
      fact: 'A plastic bottle takes 450+ years to decompose in nature.'
    },
    {
      icon: '🌱',
      title: 'Composting Benefits',
      description: 'Composting organic waste reduces methane emissions from landfills and creates nutrient-rich soil for gardens.',
      fact: 'Composting can reduce waste by up to 30%.'
    },
    {
      icon: '💡',
      title: 'E-Waste Responsibility',
      description: 'Electronic waste contains toxic metals. Never throw phones or computers in regular trash—find certified recycling centers.',
      fact: 'Only 20% of e-waste is properly recycled worldwide.'
    },
    {
      icon: '🌳',
      title: 'Carbon Footprint',
      description: 'Recycling saves energy. Making items from recycled materials uses 50-90% less energy than making new ones.',
      fact: 'Recycling 1 ton of paper saves 17 trees and 7,000 gallons of water.'
    },
    {
      icon: '🎯',
      title: 'Local Impact',
      description: 'Know your local recycling guidelines. Different regions accept different materials. Check your municipality\'s website.',
      fact: 'Communities with strong recycling programs have 25% less pollution.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in max-h-screen overflow-y-auto border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Eco Tips & Facts</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tip Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30 rounded-2xl p-6 mb-6 border border-green-100 dark:border-green-900/50">
          <div className="text-4xl mb-3">{tips[currentTip].icon}</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tips[currentTip].title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{tips[currentTip].description}</p>
          <div className="bg-white dark:bg-gray-950 rounded-lg p-3 border-l-4 border-green-500 dark:border-green-400">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">DID YOU KNOW?</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{tips[currentTip].fact}</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentTip(Math.max(0, currentTip - 1))}
            disabled={currentTip === 0}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {currentTip + 1} of {tips.length}
          </div>
          <button
            onClick={() => setCurrentTip(Math.min(tips.length - 1, currentTip + 1))}
            disabled={currentTip === tips.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {tips.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentTip(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentTip ? 'bg-green-600 dark:bg-green-500 w-6' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-xl transition-all duration-200"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
