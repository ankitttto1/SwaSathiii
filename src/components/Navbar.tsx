import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

interface Props {
  user?: any;
  onAuthClick: () => void;
  onTipsClick: () => void;
  onDashboardClick?: () => void;
}

export default function Navbar({ user, onAuthClick, onTipsClick, onDashboardClick }: Props) {
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
    { label: 'Leaderboard', href: '#leaderboard' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md shadow-green-100 dark:shadow-gray-900' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors">
              <span className="text-white text-lg">♻</span>
            </div>
            <span className="font-bold text-xl text-green-800 dark:text-green-300 tracking-tight">SwaSathiii</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-50 dark:hover:bg-gray-800 transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onTipsClick}
              className="px-4 py-2 rounded-lg text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-50 dark:hover:bg-gray-800 transition-all duration-150"
            >
              Eco Tips
            </button>
            <ThemeToggle />
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <button
                onClick={onDashboardClick}
                className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 active:scale-95 transition-all duration-150"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={onAuthClick}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  Sign In
                </button>
                <a
                  href="#scanner"
                  className="px-4 py-2 bg-white text-green-600 text-sm font-semibold rounded-lg border border-green-300 hover:bg-green-50 active:scale-95 transition-all duration-150"
                >
                  Scan Now
                </a>
              </>
            )}
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
          <div className="md:hidden py-3 pb-4 border-t border-green-100 dark:border-gray-800 animate-fade-in bg-white/95 dark:bg-gray-900/95 rounded-b-2xl shadow-lg">
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
            <button
              onClick={() => {
                onTipsClick();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 transition-colors"
            >
              Eco Tips
            </button>
            <div className="px-4 pt-3 border-t border-green-100 mt-3 space-y-2">
              {user ? (
                <button
                  onClick={() => {
                    onDashboardClick?.();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onAuthClick();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Sign In
                  </button>
                  <a
                    href="#scanner"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 bg-white text-green-600 text-sm font-semibold rounded-lg border border-green-300 hover:bg-green-50 transition-colors"
                  >
                    Scan Now
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
