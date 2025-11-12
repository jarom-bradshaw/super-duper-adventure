import { useEffect, useMemo, useRef, useState } from 'react';

type ColorTheme = 'warm' | 'ocean' | 'emerald' | 'violet' | 'gold';

const storageKey = 'color-theme';

const PALETTES: Array<{
  id: ColorTheme;
  label: string;
  colors: [string, string];
}> = [
  { id: 'warm', label: 'Warm Glow', colors: ['#f97316', '#ef4444'] },
  { id: 'ocean', label: 'Ocean Breeze', colors: ['#0ea5e9', '#6366f1'] },
  { id: 'emerald', label: 'Emerald Forest', colors: ['#10b981', '#14b8a6'] },
  { id: 'violet', label: 'Violet Bloom', colors: ['#a855f7', '#ec4899'] },
  { id: 'gold', label: 'Golden Hour', colors: ['#f59e0b', '#f97316'] },
];

function getInitialColor(): ColorTheme {
  if (typeof window === 'undefined') return 'warm';
  const stored = window.localStorage.getItem(storageKey);
  if (stored && PALETTES.find((palette) => palette.id === stored)) {
    return stored as ColorTheme;
  }
  return 'warm';
}

function applyColorTheme(theme: ColorTheme) {
  document.documentElement.setAttribute('data-color', theme);
}

const ColorThemeToggle = () => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('warm');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial = getInitialColor();
    setColorTheme(initial);
    applyColorTheme(initial);
  }, []);

  useEffect(() => {
    applyColorTheme(colorTheme);
    try {
      window.localStorage.setItem(storageKey, colorTheme);
    } catch {
      /* ignore storage errors */
    }
  }, [colorTheme]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const palette = useMemo(
    () => PALETTES.find((item) => item.id === colorTheme) ?? PALETTES[0],
    [colorTheme]
  );

  return (
    <div className="header__theme-toggle-wrapper" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="header__nav-link header__nav-link--space-between header__theme-toggle-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Select color theme (current: ${palette.label})`}
      >
        <span className="header__theme-toggle-label">
          <span
            aria-hidden
            className="header__theme-color-indicator"
            style={{
              background: `linear-gradient(135deg, ${palette.colors[0]}, ${palette.colors[1]})`,
            }}
          />
          <span className="header__theme-toggle-text">{palette.label}</span>
        </span>
        <span
          aria-hidden
          className={`header__theme-dropdown-arrow ${open ? 'header__theme-dropdown-arrow--open' : ''}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Color themes"
          className="header__theme-dropdown"
        >
          {PALETTES.map((option) => {
            const isActive = option.id === colorTheme;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setColorTheme(option.id);
                    setOpen(false);
                  }}
                  className={`header__theme-dropdown-item ${isActive ? 'header__theme-dropdown-item--active' : ''}`}
                >
                  <span
                    aria-hidden
                    className="header__theme-color-indicator"
                    style={{
                      background: `linear-gradient(135deg, ${option.colors[0]}, ${option.colors[1]})`,
                    }}
                  />
                  <span>{option.label}</span>
                  {isActive && <span aria-hidden>✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ColorThemeToggle;


