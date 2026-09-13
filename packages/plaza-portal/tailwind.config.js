/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { 50:'#f0f2f5',100:'#dce1e8',200:'#b8c3d1',300:'#94a5ba',400:'#7087a3',500:'#4c698c',600:'#3d5470',700:'#2e3f54',800:'#1f2a38',900:'#0f151c',950:'#080b10' },
        gold: { 400:'#e5b23e',500:'#d4a574',600:'#c8a87c' },
        emerald: { 400:'#34d399',500:'#10b981' },
        crimson: { 400:'#f87171',500:'#ef4444' },
      },
      fontFamily: { sans:['Inter','system-ui','sans-serif'], mono:['JetBrains Mono','monospace'] },
    },
  },
  plugins: [],
}
