/** @type {import('tailwindcss').Config} */
export default {
  future: {
    // disable modern color formats
    modernColorFormat: false,
  },
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
