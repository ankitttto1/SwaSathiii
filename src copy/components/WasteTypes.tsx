import { wasteData } from '../lib/wasteData';
import type { WasteCategory } from '../types/waste';

const displayCategories: WasteCategory[] = ['plastic', 'organic', 'metal', 'ewaste', 'paper', 'glass'];

export default function WasteTypes() {
  return (
    <section id="waste-types" className="py-20 bg-green-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full mb-4">
            Waste Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Know Your Waste</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Understanding waste categories is the first step toward responsible recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat) => {
            const data = wasteData[cat];
            return (
              <div
                key={cat}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-green-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: data.binColor + '22', border: `2px solid ${data.binColor}44` }}
                  >
                    {data.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{data.label}</h3>
                      {data.hazardous && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">Hazardous</span>
                      )}
                      {data.recyclable && !data.hazardous && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">Recyclable</span>
                      )}
                    </div>
                    <div
                      className="text-xs font-medium mt-1 flex items-center gap-1"
                      style={{ color: data.binColor }}
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.binColor }}
                      />
                      {data.binLabel}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{data.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
