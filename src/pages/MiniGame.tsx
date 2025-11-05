import { useEffect, useState } from 'react';
import MeteorGame from '../components/MeteorGame';
import TelescopeGame from '../components/TelescopeGame';

const MiniGame = () => {
  const [theme, setTheme] = useState<string>(document.documentElement.getAttribute('data-theme') || 'stars');
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      const t = el.getAttribute('data-theme') || 'stars';
      setTheme(t);
    });
    obs.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return (
    <div className="relative min-h-screen overflow-visible">
      {/* Full-bleed landscape region between header and footer */}
      <div className="relative z-10 min-h-screen">
        <div className="absolute inset-x-0 top-24 bottom-0 overflow-visible">
          {theme === 'meteors' ? (
            <MeteorGame />
          ) : (
            <TelescopeGame />
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniGame;


