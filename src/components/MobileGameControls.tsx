import { useEffect, useRef, useState } from 'react';
import '../styles/mobile-controls.css';

type ControlKeys = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  e: boolean;
  enter: boolean;
  q?: boolean; // For TelescopeGame use action
};

type MobileGameControlsProps = {
  controlKeys: React.MutableRefObject<ControlKeys>;
  showUseButton?: boolean; // For TelescopeGame
};

export default function MobileGameControls({ controlKeys, showUseButton = false }: MobileGameControlsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickStickRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const joystickCenterRef = useRef<{ x: number; y: number; radius: number } | null>(null);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [buttonStates, setButtonStates] = useState({
    grab: false,
    use: false,
    jump: false,
    down: false,
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      return window.matchMedia('(pointer: coarse)').matches || 
             window.innerWidth < 768 ||
             'ontouchstart' in window;
    };

    const updateMobile = () => setIsMobile(checkMobile());
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  // Calculate joystick center and radius
  useEffect(() => {
    if (!joystickBaseRef.current || !isMobile) return;

    const updateJoystickBounds = () => {
      if (joystickBaseRef.current) {
        const rect = joystickBaseRef.current.getBoundingClientRect();
        const radius = rect.width / 2 - 20; // Leave some margin for stick movement
        joystickCenterRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          radius,
        };
      }
    };

    updateJoystickBounds();
    window.addEventListener('resize', updateJoystickBounds);
    return () => window.removeEventListener('resize', updateJoystickBounds);
  }, [isMobile]);

  // Update game control keys based on joystick position and button states
  useEffect(() => {
    if (!isMobile) return;

    // Update joystick controls
    const threshold = 0.3; // Minimum tilt to activate
    const normalizedX = joystickPosition.x;
    
    controlKeys.current.left = normalizedX < -threshold;
    controlKeys.current.right = normalizedX > threshold;

    // Update button controls
    controlKeys.current.up = buttonStates.jump;
    controlKeys.current.down = buttonStates.down;
    controlKeys.current.e = buttonStates.grab;
    controlKeys.current.enter = buttonStates.grab;
    if (showUseButton) {
      controlKeys.current.q = buttonStates.use;
    }
  }, [joystickPosition, buttonStates, controlKeys, isMobile, showUseButton]);

  // Joystick touch handlers
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null || !joystickCenterRef.current) return;
    
    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;
    e.preventDefault();
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    if (touchIdRef.current === null || !joystickCenterRef.current) return;

    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    e.preventDefault();

    const center = joystickCenterRef.current;
    const dx = touch.clientX - center.x;
    const dy = touch.clientY - center.y;
    const distance = Math.hypot(dx, dy);

    // Clamp to joystick radius
    const clampedDistance = Math.min(distance, center.radius);
    const angle = Math.atan2(dy, dx);

    const x = clampedDistance * Math.cos(angle);
    const y = clampedDistance * Math.sin(angle);

    // Normalize to -1 to 1 range
    const normalizedX = x / center.radius;
    const normalizedY = y / center.radius;

    setJoystickPosition({ x: normalizedX, y: normalizedY });

    // Update stick visual position
    if (joystickStickRef.current) {
      joystickStickRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;

    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    e.preventDefault();
    touchIdRef.current = null;
    setJoystickPosition({ x: 0, y: 0 });

    // Reset stick visual position
    if (joystickStickRef.current) {
      joystickStickRef.current.style.transform = 'translate(0, 0)';
    }
  };

  // Button touch handlers
  const handleButtonTouchStart = (button: 'grab' | 'use' | 'jump' | 'down') => (e: React.TouchEvent) => {
    e.preventDefault();
    setButtonStates(prev => ({ ...prev, [button]: true }));
  };

  const handleButtonTouchEnd = (button: 'grab' | 'use' | 'jump' | 'down') => (e: React.TouchEvent) => {
    e.preventDefault();
    setButtonStates(prev => ({ ...prev, [button]: false }));
  };

  // Prevent default touch behaviors
  useEffect(() => {
    if (!isMobile) return;

    const preventDefault = (e: TouchEvent) => {
      // Only prevent default on touch events within the control area
      const target = e.target as HTMLElement;
      if (target.closest('.mobile-game-controls')) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('touchstart', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('touchstart', preventDefault);
    };
  }, [isMobile]);

  if (!isMobile) {
    return null;
  }

  return (
    <div className="mobile-game-controls">
      {/* Joystick (left side) */}
      <div
        ref={joystickBaseRef}
        className="joystick-base"
        onTouchStart={handleJoystickTouchStart}
        onTouchMove={handleJoystickTouchMove}
        onTouchEnd={handleJoystickTouchEnd}
        onTouchCancel={handleJoystickTouchEnd}
      >
        <div ref={joystickStickRef} className="joystick-stick" />
      </div>

      {/* Action buttons (right side) */}
      <div className="action-buttons">
        <button
          type="button"
          className={`action-button grab-button ${buttonStates.grab ? 'pressed' : ''}`}
          onTouchStart={handleButtonTouchStart('grab')}
          onTouchEnd={handleButtonTouchEnd('grab')}
          onTouchCancel={handleButtonTouchEnd('grab')}
          aria-label="Grab/Interact"
        >
          <span className="button-label">Grab</span>
        </button>
        
        {showUseButton && (
          <button
            type="button"
            className={`action-button use-button ${buttonStates.use ? 'pressed' : ''}`}
            onTouchStart={handleButtonTouchStart('use')}
            onTouchEnd={handleButtonTouchEnd('use')}
            onTouchCancel={handleButtonTouchEnd('use')}
            aria-label="Use"
          >
            <span className="button-label">Use</span>
          </button>
        )}
        
        <button
          type="button"
          className={`action-button jump-button ${buttonStates.jump ? 'pressed' : ''}`}
          onTouchStart={handleButtonTouchStart('jump')}
          onTouchEnd={handleButtonTouchEnd('jump')}
          onTouchCancel={handleButtonTouchEnd('jump')}
          aria-label="Jump"
        >
          <span className="button-label">Jump</span>
        </button>
        
        <button
          type="button"
          className={`action-button down-button ${buttonStates.down ? 'pressed' : ''}`}
          onTouchStart={handleButtonTouchStart('down')}
          onTouchEnd={handleButtonTouchEnd('down')}
          onTouchCancel={handleButtonTouchEnd('down')}
          aria-label="Go Down"
        >
          <span className="button-label">Down</span>
        </button>
      </div>
    </div>
  );
}

