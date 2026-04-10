/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
       heading: ['Clash Display', 'sans-serif'],
    body: ['Inter', 'sans-serif'],

      },
    },
  },
  plugins: [],
}