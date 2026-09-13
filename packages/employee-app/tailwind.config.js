/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { 800:'#1f2a38', 900:'#0f151c', 950:'#080b10' },
        brand: { 500:'#b8924e', 600:'#a67d3a' },
      },
      fontFamily: { sans:['Inter','system-ui','sans-serif'], mono:['JetBrains Mono','monospace'] },
    },
  },
  plugins: [],
}
