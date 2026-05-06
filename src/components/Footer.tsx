export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow">
                <span className="text-white text-lg">♻</span>
              </div>
              <span className="font-bold text-xl tracking-tight">SwaSathiii</span>
            </div>
            <p className="text-green-200/70 text-sm leading-relaxed max-w-xs">
              AI-powered waste classification to help you make smarter disposal decisions and protect our environment.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-green-300 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['How It Works', '#how-it-works'],
                ['Classify Waste', '#scanner'],
                ['Waste Types', '#waste-types'],
                ['Scan History', '#history'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-green-200/70 hover:text-green-300 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Waste types */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-green-300 mb-4">Waste Categories</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['♻', 'Plastic'],
                ['🌱', 'Organic'],
                ['🥫', 'Metal'],
                ['📱', 'E-Waste'],
                ['📄', 'Paper'],
                ['🫙', 'Glass'],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2 text-green-200/70">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-green-200/50">
          <p>&copy; {year} SwaSathiii. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-green-400">♡</span> for a cleaner planet
          </p>
        </div>
      </div>
    </footer>
  );
}
