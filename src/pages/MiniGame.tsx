import StarscapeGame from '../components/StarscapeGame';
import MeteorGame from '../components/MeteorGame';
import TelescopeGame from '../components/TelescopeGame';

const MiniGame = () => {
  return (
    <div className="relative min-h-screen overflow-visible">
      {/* Full-bleed landscape region between header and footer */}
      <div className="relative z-10 min-h-screen">
        <div className="absolute inset-x-0 top-24 bottom-0 overflow-visible">
          {document.documentElement.getAttribute('data-theme') === 'meteors' ? (
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


