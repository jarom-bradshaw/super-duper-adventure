import { useState, useEffect } from 'react';

const Hero = () => {
  const phrases = [
    'Software Developer',
    'Data Engineer',
    'ML Engineer',
    'Full Stack Developer',
  ];
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const current = phrases[currentPhrase];

    if (!isDeleting && displayText === current) {
      const pauseTimeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pauseTimeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(current.substring(0, displayText.length - 1));
      } else {
        setDisplayText(current.substring(0, displayText.length + 1));
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhrase, phrases]);

  return (
    <div className="pt-24 pb-12 flex items-center justify-center px-6 min-h-[calc(100vh-6rem)]">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text">
          Jarom Bradshaw
        </h1>
        <p className="text-xl md:text-3xl text-[color:var(--muted-foreground)] mb-6 min-h-[3rem]">
          {displayText}
          <span className="animate-pulse">|</span>
        </p>
        <p className="text-base md:text-lg text-[color:var(--muted-foreground)]/80 max-w-2xl mx-auto">
          Software Developer with a passion for building scalable, impactful solutions.
          Currently pursuing a Bachelors of Science in Computer Science with a Minor in Statistics.
        </p>
      </div>
    </div>
  );
};

export default Hero;

