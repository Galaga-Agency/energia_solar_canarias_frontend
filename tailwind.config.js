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
        shimmer: "shimmer 2s infinite",
        "rise-sun": "riseSun 4s ease-in-out infinite",
        "rain-drop": "rainDrop 1.5s ease-in-out infinite",
        "snow-fall": "snowFall 3s linear infinite",
        "energy-flow": "energyFlow 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "flow-right": "flowRight 2s ease-in-out infinite",
        "flow-left": "flowLeft 2s ease-in-out infinite",
        fade: "fadeIn 0.5s ease-in-out",
        bounceX: "bounceX 1.2s infinite",
        bubble: "float 6s ease-in-out infinite",
        "drop-smooth": "smoothDrop 4s linear infinite",
        fall: "fall 5s linear infinite",
        drop: "drop 5s linear infinite",
        "leaf-fall": "leafFall 7s ease-in-out infinite",
        "gradient-move": "gradientMove 5s ease-in-out infinite",
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
        "double-blink":
          "doubleBlink 1.2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
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
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        riseSun: {
          "0%": { transform: "translateY(50px) scale(0.8)", opacity: "0" },
          "50%": { transform: "translateY(0) scale(1.2)", opacity: "0.8" },
          "100%": { transform: "translateY(-20px) scale(1)", opacity: "1" },
        },
        rainDrop: {
          "0%": { transform: "translateY(-100px)", opacity: "0" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateY(200px)", opacity: "0" },
        },
        snowFall: {
          "0%": { transform: "translateY(-50px) rotate(0deg)", opacity: "1" },
          "50%": {
            transform: "translateY(100px) rotate(180deg)",
            opacity: "0.6",
          },
          "100%": {
            transform: "translateY(200px) rotate(360deg)",
            opacity: "0",
          },
        },
        energyFlow: {
          "0%": { opacity: 0.2, transform: "translateX(0) scale(0.8)" },
          "50%": { opacity: 1, transform: "translateX(20px) scale(1)" },
          "100%": { opacity: 0.2, transform: "translateX(40px) scale(0.8)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(255, 255, 0, 0.5)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 255, 0, 1)" },
        },
        flowRight: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        flowLeft: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceX: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
        },
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
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "25%": {
            opacity: "0.3",
            transform: "scale(1.05)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "75%": {
            opacity: "0.3",
            transform: "scale(1.05)",
          },
        },
      },
      perspective: {
        1000: "1000px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
