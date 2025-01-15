/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        fade: 'fade 1.5s infinite'
      },
      keyframes: {
        fade: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 }
        }
      }
    },
    colors: {
      darkslate: 'var(--dark-slate )',
      slate: 'var(--slate)',
      lightslate: 'var(--light-slate)',
      white: 'var(--white)',
      green: 'var(--green)',
      black: 'var(--black)',
      blue: 'var(--blue)',
      red: 'var(--red)',
      navy: 'var(--navy)',
      darknavy: 'var(--dark-navy)'
    }
  },
  plugins: [],
  darkMode: 'selector'
};