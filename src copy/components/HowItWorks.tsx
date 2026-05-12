export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: '📸',
      title: 'Upload or Capture',
      desc: 'Take a photo with your camera or upload an image of the waste item you want to classify.',
    },
    {
      step: '02',
      icon: '🤖',
      title: 'AI Analysis',
      desc: 'Our AI model analyzes the image and identifies the waste type with high confidence.',
    },
    {
      step: '03',
      icon: '🗑️',
      title: 'Get Results',
      desc: 'See the correct bin color, waste category, and tailored recycling tips instantly.',
    },
    {
      step: '04',
      icon: '🌍',
      title: 'Take Action',
      desc: 'Dispose responsibly using our guidance and help reduce environmental pollution.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Four easy steps to classify your waste and make smarter disposal decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="relative bg-green-50 dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-green-100 dark:hover:shadow-green-950/40 hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-xs font-bold text-green-400 dark:text-green-500 mb-3">{s.step}</div>
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-green-300 dark:text-green-600 text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
