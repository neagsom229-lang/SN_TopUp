/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f19',
        cardBg: '#1e293b',
        primary: '#10b981',
        accent: '#4f46e5',
        lightBg: '#f8fafc',
        lightCard: '#ffffff',
        gray: {
          300: '#d1d5db',
          400: '#cbd5e1', // Enhanced contrast >= 4.5:1
          500: '#94a3b8',
        },
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-accent': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
