/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bms-red": "#e53e3e",
        "bms-gray": "#f7fafc",
        "bms-dark": "#2d3748",
        "bms-success": "#38a169",
        "bms-warning": "#ed8936",
      },
    },
  },
  plugins: [],
}