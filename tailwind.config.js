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
        "spin-fast": "spin 1s linear infinite",
        flash: "flash 1.5s ease-in-out forwards",
        orbit: "orbit 2s linear infinite",
        "orbit-reverse": "orbit 2s linear infinite reverse",
        "react-orbit": "react-orbit 2.5s linear infinite",
        "orbit-path-1": "orbit-path-1 2.5s linear infinite",
        "orbit-path-2": "orbit-path-2 3s linear infinite reverse",
        "orbit-path-3": "orbit-path-3 4s linear infinite",
        "orbit-path-4": "orbit-path-4 3.5s linear infinite reverse",
        grid: "grid 150s linear infinite",
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
        "gradient-purple": "#8A2BE2",
        "gradient-blue": "#1E90FF",
      },
      boxShadow: {
        "dark-shadow": "rgba(0, 0, 0, 1) 0px 0px 8px",
        "white-shadow": "rgba(255, 255, 255, 1) 0px 0px 8px",
        "hover-white-shadow": "rgba(255, 255, 255, 0.8) 0px 0px 32px",
        "hover-dark-shadow": "rgba(0, 0, 0, 0.8) 0px 0px 32px",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        flash: {
          "0%": { boxShadow: "0 0 0 rgba(255, 255, 255, 0)" },
          "50%": {
            boxShadow: "0 0 25px rgba(255, 255, 255, 1)",
            borderRadius: "20px",
          },
          "100%": { boxShadow: "0 0 0 rgba(255, 255, 255, 0)" },
        },
        grid: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        // Expanded orbit paths for larger radius effect
        "orbit-path-1": {
          "0%": { transform: "rotate(0deg) translateX(70px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(70px) rotate(-360deg)",
          },
        },
        "orbit-path-2": {
          "0%": { transform: "rotate(0deg) translateX(60px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(60px) rotate(-360deg)",
          },
        },
        "orbit-path-3": {
          "0%": { transform: "rotate(0deg) translateX(80px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(80px) rotate(-360deg)",
          },
        },
        "orbit-path-4": {
          "0%": { transform: "rotate(0deg) translateX(65px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(65px) rotate(-360deg)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
