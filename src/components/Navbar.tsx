import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import ThemeToggle from './ThemeToggle';

function navProfileFromUser(user: User) {
  const email = user.email ?? '';
  const meta = user.user_metadata as { display_name?: string } | undefined;
  const displayName = meta?.display_name?.trim() || email.split('@')[0] || 'Account';
  const words = displayName.split(/\s+/).filter(Boolean);
  let initials = '♻';
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words[0]?.length >= 2) {
    initials = words[0].slice(0, 2).toUpperCase();
  } else if (email.length >= 2) {
    initials = email.slice(0, 2).toUpperCase();
  }
  return { displayName, email, initials };
}

interface Props {
  user?: User | null;
  onAuthClick: () => void;
  onTipsClick: () => void;
  onDashboardClick?: () => void;
  /** Called from navbar Log out on dashboard (`layout="surface"`) */
  onSignOut?: () => void | Promise<void>;
  /** `surface` = light pages (dashboard): solid bar + dark nav text. Default `hero` = transparent over dark hero until scroll */
  layout?: 'hero' | 'surface';
}

export default function Navbar({
  user,
  onAuthClick,
  onTipsClick,
  onDashboardClick,
  onSignOut,
  layout = 'hero',
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const showDashboardProfile = layout === 'surface' && !!user && !!onSignOut;
  const profile = user ? navProfileFromUser(user) : null;

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

  /** Light-on-dark hero styling only when transparent over marketing hero — not on dashboard/light surfaces */
  const solidBar = layout === 'surface' || scrolled;
  const overHero = !solidBar;
  const navLink =
    overHero
      ? 'text-white hover:text-white hover:bg-white/15 dark:text-green-50 dark:hover:text-white dark:hover:bg-white/10'
      : 'text-green-900 hover:text-green-950 hover:bg-green-50 dark:text-green-300 dark:hover:text-green-100 dark:hover:bg-gray-800';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidBar ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md shadow-green-100 dark:shadow-gray-900' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 h-16 min-w-0">
          <a href="#" className="flex shrink-0 items-center gap-2 group min-w-0">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors">
              <span className="text-white text-lg">♻</span>
            </div>
            <span
              className={`font-bold text-xl tracking-tight drop-shadow-sm ${
                overHero ? 'text-white dark:text-green-50' : 'text-green-900 dark:text-green-300'
              }`}
            >
              SwachhSaathi
            </span>
          </a>

          <div className="hidden md:flex flex-1 min-w-0 items-center justify-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${navLink}`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onTipsClick}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${navLink}`}
            >
              Eco Tips
            </button>
            <ThemeToggle overDarkBackdrop={overHero} />
          </div>

          <div className="hidden md:flex shrink-0 items-center gap-2">
            {user ? (
              showDashboardProfile && profile ? (
                <>
                  <div
                    className="flex max-w-[220px] items-center gap-2 rounded-xl border border-green-200 bg-green-50/90 px-2 py-1 dark:border-gray-600 dark:bg-gray-800/90"
                    title={profile.email}
                    aria-label={`Signed in as ${profile.displayName}`}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white ring-2 ring-green-100 dark:ring-green-900"
                      aria-hidden
                    >
                      {profile.initials}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="truncate text-xs font-semibold text-green-900 dark:text-green-100">
                        {profile.displayName}
                      </div>
                      <div className="truncate text-[11px] text-gray-500 dark:text-gray-400">{profile.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDashboardClick?.()}
                    className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 dark:text-green-200 dark:hover:bg-gray-800"
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => void onSignOut?.()}
                    className="whitespace-nowrap rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onDashboardClick}
                  className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 transition-all duration-150 hover:bg-green-200 active:scale-95 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60"
                >
                  Dashboard
                </button>
              )
            ) : (
              <>
                <button
                  type="button"
                  onClick={onAuthClick}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-green-700 active:scale-95"
                >
                  Sign In
                </button>
                <a
                  href="#scanner"
                  className="rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-600 transition-all duration-150 hover:bg-green-50 active:scale-95 dark:border-green-700 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
                >
                  Scan Now
                </a>
              </>
            )}
          </div>

          <button
            type="button"
            className={`md:hidden p-2 rounded-lg transition-colors ${
              overHero
                ? 'text-white hover:bg-white/15 dark:text-green-50 dark:hover:bg-white/10'
                : 'text-green-900 hover:bg-green-50 dark:text-green-300 dark:hover:bg-gray-800'
            }`}
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
                className="block px-4 py-3 text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                onTipsClick();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
            >
              Eco Tips
            </button>
            <div className="px-4 py-2 flex items-center gap-2 border-t border-green-100 dark:border-gray-800 mt-2 pt-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Theme</span>
              <ThemeToggle overDarkBackdrop={false} />
            </div>
            <div className="mt-3 space-y-2 border-t border-green-100 px-4 pt-3 dark:border-gray-800">
              {user ? (
                showDashboardProfile && profile ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50/80 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800/80">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white"
                        aria-hidden
                      >
                        {profile.initials}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-semibold text-green-900 dark:text-green-100">
                          {profile.displayName}
                        </div>
                        <div className="truncate text-xs text-gray-500 dark:text-gray-400">{profile.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onDashboardClick?.();
                        setMenuOpen(false);
                      }}
                      className="w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-green-800 transition-colors hover:bg-green-50 dark:text-green-200 dark:hover:bg-gray-800"
                    >
                      Home
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void onSignOut?.();
                        setMenuOpen(false);
                      }}
                      className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onDashboardClick?.();
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg bg-green-100 px-4 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60"
                  >
                    Dashboard
                  </button>
                )
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
                    className="block w-full text-center px-4 py-2.5 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 text-sm font-semibold rounded-lg border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
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
