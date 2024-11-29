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
        bubble: "float 6s ease-in-out infinite",
        "drop-smooth": "smoothDrop 4s linear infinite",
        fall: "fall 5s linear infinite",
        drop: "drop 5s linear infinite",
        "leaf-fall": "leafFall 7s ease-in-out infinite",
        "gradient-move": "gradientMove 5s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "gradient-spin": "spin 5s linear infinite",
        "icon-float": "float 6s ease-in-out infinite",
        "icon-float-alt": "float-alt 6s ease-in-out infinite",
        float: "float 12s ease-in-out infinite",
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
        textBlink: "textBlink 0.5s ease-in-out",
        "double-blink": "doubleBlink 1s ease-in-out 1",
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
      boxShadow: {
        "dark-shadow": "rgba(0, 0, 0, 1) 0px 0px 8px",
        "white-shadow": "rgba(255, 255, 255, 1) 0px 0px 8px",
        "hover-white-shadow": "rgba(255, 255, 255, 0.8) 0px 0px 32px",
        "hover-dark-shadow": "rgba(0, 0, 0, 0.8) 0px 0px 32px",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "50%": { transform: "translateY(-20px) scale(1.2)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
        },
        smoothDrop: {
          "0%": { transform: "translateY(-100%)", opacity: "0.8" },
          "50%": { transform: "translateY(50%)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        fall: {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        drop: {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        leafFall: {
          "0%": {
            transform: "translate(-50px, -100%) rotate(0deg)",
            opacity: "1",
          },
          "50%": {
            transform: "translate(50px, 50%) rotate(180deg)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translate(-50px, 100%) rotate(360deg)",
            opacity: "0",
          },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float-alt": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(10px)" },
        },
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
        textBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        grid: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
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
        doubleBlink: {
          "0%, 100%": { opacity: "1" },
          "25%, 50%": { opacity: "0.3" },
          "75%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
