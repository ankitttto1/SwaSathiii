export default function Hero() {
  const stats = [
    { value: '2.12B', label: 'Tons of waste per year' },
    { value: '91%', label: 'Plastic never recycled' },
    { value: '50M', label: 'Tons of e-waste annually' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        {/* Floating leaves */}
        <div className="absolute top-1/4 left-1/4 text-5xl opacity-10 animate-float">🌿</div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-10 animate-float delay-200">♻️</div>
        <div className="absolute bottom-1/3 left-1/3 text-3xl opacity-10 animate-float delay-400">🌱</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/20 border border-green-400/30 rounded-full text-green-300 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI-Powered Waste Classification
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 animate-fade-in-up delay-100">
          Classify Waste.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
            Save the Planet.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-green-100/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          Upload a photo or use your camera to instantly identify waste type, get the right bin color, and learn eco-friendly disposal tips.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          <a
            href="#scanner"
            className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-900/40 hover:shadow-green-900/60 active:scale-95 transition-all duration-200"
          >
            Start Scanning
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-lg rounded-2xl border border-white/20 hover:border-white/30 active:scale-95 transition-all duration-200"
          >
            How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fade-in-up delay-400">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-green-300">{stat.value}</div>
              <div className="text-xs sm:text-sm text-green-200/60 mt-1 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="#f0fdf4" />
        </svg>
      </div>
    </section>
  );
}
