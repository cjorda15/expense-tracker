/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
      colors: {
        green: 'var(--green)',
        black: 'var(--black)',
        blue: 'var(--blue)',
        red: 'var(--red)',
        navy: 'var(--navy)',
        darknavy:"var(--dark-navy)"
    },
  },
  plugins: [],
  darkMode: 'selector'
}