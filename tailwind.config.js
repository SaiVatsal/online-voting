/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          navy: '#0f172a',
          'navy-light': '#1e293b',
          crimson: '#991b1b',
          'crimson-bright': '#dc2626',
          parchment: '#f8fafc',
          gold: '#d97706'
        }
      }
    },
  },
  plugins: [],
}
