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
      className="header__nav-link"
    >
      <span className="sr-only">Toggle theme</span>
      <span aria-hidden>{isStars ? '🌟' : '☄️'}</span>
    </button>
  );
};

export default ThemeToggle;


