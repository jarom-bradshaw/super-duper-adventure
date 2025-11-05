import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/resume', label: 'Resume' },
    { path: '/ml', label: 'ML Projects' },
    { path: '/full-stack', label: 'Full Stack' },
    { path: '/mobile', label: 'Mobile' },
    { path: '/games', label: 'Games' },
    { path: '/extensions', label: 'Extensions' },
    { path: '/referrals', label: 'Referrals' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 glass-card">
      <nav className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold gradient-text">
            Jarom Bradshaw
          </Link>
          <ul className="flex space-x-2 md:space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-sm md:text-base transition-colors hover:text-cyan-400 ${
                    location.pathname === item.path
                      ? 'text-cyan-400'
                      : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

