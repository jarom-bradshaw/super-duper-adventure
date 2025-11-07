import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import '../styles/header.css';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/resume', label: 'Resume' },
    { path: '/ml', label: 'ML Projects' },
    { path: '/full-stack', label: 'Full Stack' },
    { path: '/mobile', label: 'Mobile' },
    { path: '/games', label: 'Games' },
    { path: '/extensions', label: 'Extensions' },
    { path: '/mini-game', label: 'Mini Game' },
    { path: '/referrals', label: 'Referrals' },
  ];

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <header className="header" role="banner">
        <nav className="header__container" aria-label="Main navigation">
          <Link 
            to="/" 
            className="header__logo"
            aria-label="Jarom Bradshaw - Home"
          >
            Jarom Bradshaw
          </Link>
          <div className="header__nav-wrapper">
            <button
              type="button"
              className="header__menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="header__menu-toggle-icon" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            {menuOpen && (
              <div
                className="header__backdrop"
                aria-hidden="true"
                onClick={() => setMenuOpen(false)}
              />
            )}
            <ul 
              id="main-nav"
              className="header__nav"
              aria-hidden={!menuOpen}
            >
              {navItems.map((item) => (
                <li key={item.path} className="header__nav-item">
                  <Link
                    to={item.path}
                    className={`header__nav-link ${
                      location.pathname === item.path ? 'header__nav-link--active' : ''
                    }`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;

