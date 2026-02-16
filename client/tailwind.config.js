/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon Status colors for facilities
        'facility-excellent': '#10B981', // Emerald 500
        'facility-good': '#3B82F6',      // Blue 500
        'facility-moderate': '#F59E0B',  // Amber 500
        'facility-high': '#F97316',      // Orange 500
        'facility-overcapacity': '#EF4444', // Red 500
        'facility-critical': '#DC2626',   // Red 600

        // Cyberpunk / Neon Palette
        'neon-blue': '#00f3ff',
        'neon-purple': '#bc13fe',
        'neon-green': '#0affa5',
        'deep-space': '#020617', // Slate 950
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
