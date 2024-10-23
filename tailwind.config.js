/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['"Adam Bold"', "sans-serif"],
        secondary: ['"Corbert"', "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        grid: "grid 150s linear infinite",
        "spin-fast": "spin 1s linear infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "custom-yellow": "rgb(255, 213, 122)",
        "custom-dark-blue": "rgb(0, 44, 63)",
        "custom-light-gray": "rgb(201, 202, 202)",
        "custom-dark-gray": "rgb(161, 161, 170)",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, rgb(255, 213, 122), rgb(0, 44, 63))",
      },
      boxShadow: {
        "dark-shadow": "rgba(0, 0, 0, 1) 0px 0px 8px",
        "white-shadow": "rgba(255, 255, 255, 1) 0px 0px 8px",
        "hover-white-shadow": "rgba(255, 255, 255, 0.8) 0px 0px 32px",
        "hover-dark-shadow": "rgba(0, 0, 0, 0.8) 0px 0px 32px",
      },
      backdropBlur: ["responsive"],
      keyframes: {
        grid: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
