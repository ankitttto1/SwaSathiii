import { useLayoutEffect, useState } from 'react';

function readDarkPreference(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('darkMode');
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

interface ThemeToggleProps {
  /** Use when the control sits on a dark hero/image so icons stay readable */
  overDarkBackdrop?: boolean;
}

export default function ThemeToggle({ overDarkBackdrop = false }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(readDarkPreference);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  const toggleTheme = () => setIsDark((d) => !d);

  const btnBase =
    overDarkBackdrop && !isDark
      ? 'p-2 rounded-lg text-white hover:bg-white/15 transition-colors [&_svg]:!text-white'
      : 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={btnBase}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.657 9.193l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}
