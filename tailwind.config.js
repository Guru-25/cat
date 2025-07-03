/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'caterpillar-yellow': '#FDD835',
        'caterpillar-black': '#1C1C1C',
        'caterpillar-gray': '#8E8E8E',
      }
    },
  },
  plugins: [],
} 