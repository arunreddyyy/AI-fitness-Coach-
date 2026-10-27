/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#090d14',
          900: '#0e141f',
          850: '#141c2b',
          800: '#1a2436',
          700: '#23324a',
          600: '#2f4161',
        },
        navy: {
          950: '#090d14',
          900: '#0e141f',
          850: '#141c2b',
          800: '#1a2436',
          700: '#23324a',
          600: '#2f4161',
        },
        lime: {
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          neon: '#a3e635',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        cyan: {
          neon: '#00f2fe',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      boxShadow: {
        'glow-lime': '0 0 20px -3px rgba(163, 230, 53, 0.4)',
        'glow-lime-sm': '0 0 10px -2px rgba(163, 230, 53, 0.25)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-emerald-sm': '0 0 10px -2px rgba(16, 185, 129, 0.25)',
        'glow-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.35)',
        'glow-cyan-sm': '0 0 10px -2px rgba(0, 242, 254, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
