import { useEffect, useState } from 'react';

export default function OrientationWarning() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile/touch device
    const checkMobile = () => {
      return window.matchMedia('(pointer: coarse)').matches || 
             window.innerWidth < 768 ||
             'ontouchstart' in window;
    };

    // Check orientation
    const checkOrientation = () => {
      // Use window.matchMedia for orientation detection
      const portraitQuery = window.matchMedia('(orientation: portrait)');
      return portraitQuery.matches || window.innerHeight > window.innerWidth;
    };

    const updateState = () => {
      const mobile = checkMobile();
      const portrait = checkOrientation();
      setIsMobile(mobile);
      setIsPortrait(portrait && mobile);
    };

    // Initial check
    updateState();

    // Listen for orientation changes
    const portraitQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientationChange = () => updateState();
    
    // Use modern matchMedia listener if available
    if (portraitQuery.addEventListener) {
      portraitQuery.addEventListener('change', handleOrientationChange);
    } else {
      // Fallback for older browsers
      portraitQuery.addListener(handleOrientationChange);
    }

    // Also listen for resize events
    window.addEventListener('resize', updateState);

    return () => {
      if (portraitQuery.removeEventListener) {
        portraitQuery.removeEventListener('change', handleOrientationChange);
      } else {
        portraitQuery.removeListener(handleOrientationChange);
      }
      window.removeEventListener('resize', updateState);
    };
  }, []);

  // Only show on mobile devices in portrait mode
  if (!isMobile || !isPortrait) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="glass-card rounded-lg p-8 max-w-md w-[90%] text-center text-[color:var(--text)]">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-bold mb-4 gradient-text">Landscape Mode Required</h2>
        <p className="text-lg text-[color:var(--muted-foreground)]">
          This game can only be played in landscape orientation.
        </p>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-4">
          Please rotate your device to landscape mode to continue playing.
        </p>
      </div>
    </div>
  );
}

