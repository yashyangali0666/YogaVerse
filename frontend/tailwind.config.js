/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f4',
          100: '#e5ece5',
          200: '#ccd9cc',
          300: '#a7bfa7',
          400: '#7e9f7e',
          500: '#5e835e', // Primary brand sage
          600: '#496849',
          700: '#3a533a',
          800: '#304230',
          900: '#283728',
          950: '#141d14',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f9f6ef',
          200: '#f2ecdc',
          300: '#e7dcbf',
          400: '#d9c79d',
          500: '#cbb17e',
        },
        earth: {
          50: '#fbf8f5',
          100: '#f5eee6',
          200: '#ebdcce',
          300: '#dbc3ad',
          400: '#c5a286',
          500: '#aa8265',
          600: '#946d53',
          700: '#7b5743',
          800: '#644738',
          900: '#533c30',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'breathe-slow': 'breathe 16s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '25%': { transform: 'scale(1.4)', opacity: '1' }, // Inhale peak
          '50%': { transform: 'scale(1.4)', opacity: '1' }, // Hold peak
          '75%': { transform: 'scale(1)', opacity: '0.8' },   // Exhale complete
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
