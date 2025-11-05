import { useEffect, useState } from 'react';

type Theme = 'meteors' | 'stars';

const storageKey = 'theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'meteors';
  const raw = window.localStorage.getItem(storageKey);
  if (raw === 'light') return 'meteors';
  if (raw === 'dark') return 'stars';
  if (raw === 'meteors' || raw === 'stars') return raw as Theme;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'stars' : 'meteors';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('meteors');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'stars' ? 'meteors' : 'stars'));

  const isStars = theme === 'stars';

  return (
    <button
      type="button"
      aria-pressed={isStars}
      aria-label="Toggle theme"
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--text)]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link)] transition"
    >
      <span className="sr-only">Toggle theme</span>
      <span aria-hidden>{isStars ? '🌟' : '☄️'}</span>
    </button>
  );
};

export default ThemeToggle;


