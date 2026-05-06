import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Classify Waste', href: '#scanner' },
    { label: 'Waste Types', href: '#waste-types' },
    { label: 'History', href: '#history' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md shadow-green-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors">
              <span className="text-white text-lg">♻</span>
            </div>
            <span className="font-bold text-xl text-green-800 tracking-tight">SwaSathiii</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#scanner"
              className="ml-3 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Scan Now
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-3 pb-4 border-t border-green-100 animate-fade-in bg-white/95 rounded-b-2xl shadow-lg">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <a
                href="#scanner"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Scan Now
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
