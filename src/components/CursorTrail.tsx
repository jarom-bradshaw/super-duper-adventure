import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
}

const CursorTrail = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Detect mobile/touch devices
    const checkMobile = () => {
      return window.matchMedia('(pointer: coarse)').matches || 
             window.innerWidth < 768;
    };
    
    setIsMobile(checkMobile());
    
    const handleResize = () => {
      setIsMobile(checkMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newParticle: Particle = {
        x: e.clientX,
        y: e.clientY,
        life: 1,
        maxLife: 1,
        size: Math.random() * 4 + 3,
      };

      particlesRef.current.push(newParticle);
      
      // Limit number of particles
      if (particlesRef.current.length > 20) {
        particlesRef.current.shift();
      }

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      setParticles([...particlesRef.current]);
      
      // Update and remove dead particles
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          life: p.life - 0.02,
        }))
        .filter((p) => p.life > 0);

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="cursor-trail-container" aria-hidden="true">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="cursor-trail-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.life,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `translate(-50%, -50%) scale(${particle.life})`,
          }}
        />
      ))}
    </div>
  );
};

export default CursorTrail;


