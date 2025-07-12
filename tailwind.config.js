/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          100: "#F8F9FA", // Light background and text
        },
        dark: {
          DEFAULT: "#0E0E1B", // Main dark background
          800: "#1C1C2D",     // Card/Modal background
          700: "#12121D",     // Slightly lighter background
        },
        accent: {
          DEFAULT: "#00FF85", // Bright green accent
        },
        gray: {
          500: "#7A7A7A",     // Placeholder/secondary text
        },
      },
    },
  },
  plugins: [],
}
