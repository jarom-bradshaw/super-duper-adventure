/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0d1d31',
        'dark-blue-black': '#0c0d13',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'pulse-border': 'pulse-border 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-border': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(34, 211, 238, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

