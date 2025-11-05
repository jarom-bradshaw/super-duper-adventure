import { useEffect, useRef } from 'react';
import '../styles/stars.css';

// Star Animation Component - Credit: alphardex
// Original SCSS converted to CSS and React component

const StarBackground = () => {
    const starsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!starsRef.current) return;

        const starCount = 50;
        const stars = starsRef.current;

        // Generate random values for each star
        const randomRange = (min: number, max: number) => {
            return min + Math.floor(Math.random() * (max - min + 1));
        };

        // Clear existing stars
        stars.innerHTML = '';

        // Create stars with random properties
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            const tailLength = randomRange(500, 750) / 100;
            const topOffset = randomRange(0, 10000) / 100;
            const fallDuration = randomRange(6000, 12000) / 1000;
            const fallDelay = randomRange(0, 10000) / 1000;

            star.style.setProperty('--star-tail-length', `${tailLength}em`);
            star.style.setProperty('--top-offset', `${topOffset}vh`);
            star.style.setProperty('--fall-duration', `${fallDuration}s`);
            star.style.setProperty('--fall-delay', `${fallDelay}s`);

            stars.appendChild(star);
        }
    }, []);

    return <div className="stars" ref={starsRef} />;
};

export default StarBackground;

