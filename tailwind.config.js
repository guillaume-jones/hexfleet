const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['"Exo 2"', 'sans-serif'],
      orbitron: ['Orbitron', 'sans-serif'],
    },
    extend: {
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      keyframes: {
        blink: {
          '0%, 35%, 100%': { opacity: 0 },
          '45%, 95%': { opacity: 1 },
        },
      },
      animation: {
        blink: 'blink 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
