/**
 * Tailwind CSS Configuration
 *
 * This configuration file serves as the central hub for all custom styling logic.
 * Instead of using global.css for custom styles, animations, and utilities,
 * we've chosen to define everything possible here in the Tailwind config.
 *
 * Benefits of this approach:
 * - Single source of truth for styling
 * - Better maintainability (all custom styles in one place)
 * - Easier to track and modify design tokens
 * - Prevents CSS specificity issues
 * - Keeps global.css clean and minimal
 * - Allows for better tree-shaking of unused styles
 *
 * The global.css file is reserved only for:
 * - CSS Reset
 * - Root variables
 * - Styles that absolutely cannot be achieved through Tailwind
 */

const { heroui } = require("@heroui/theme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode using class strategy instead of media queries
  darkMode: ["class"],

  // Define which files Tailwind should scan for classes
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Include HeroUI components that we're using
    "./node_modules/@heroui/theme/dist/components/(popover|button|ripple|spinner).js",
  ],

  theme: {
    extend: {
      // Custom font families for consistent typography
      fontFamily: {
        primary: ['"Adam Bold"', "sans-serif"],
        secondary: ['"Corbert"', "sans-serif"],
      },

      // Custom animation delays for staggered animations
      animationDelay: {
        300: "300ms",
        500: "500ms",
        700: "700ms",
        900: "900ms",
        1100: "1100ms",
        1300: "1300ms",
        1500: "1500ms",
      },

      // Custom animation definitions
      // These can be used with classes like 'animate-fade', 'animate-float', etc.
      animation: {
        // Base animations
        fade: "fadeIn 0.5s ease-in-out",
        bubble: "float 6s ease-in-out infinite",

        // Falling animations for various effects
        fall: "fall 5s linear infinite",
        drop: "drop 5s linear infinite",
        "leaf-fall": "leafFall 7s ease-in-out infinite",

        // Spinning animations at different speeds
        "spin-slow": "spin 3s linear infinite",
        "spin-fast": "spin 1s linear infinite",

        // Floating animation for subtle movements
        float: "float 12s ease-in-out infinite",

        // Orbit animations for circular movements
        "orbit-path-1": "orbit-path-1 2.5s linear infinite",
        "orbit-path-2": "orbit-path-2 3s linear infinite reverse",
        "orbit-path-3": "orbit-path-3 4s linear infinite",
        "orbit-path-4": "orbit-path-4 3.5s linear infinite reverse",

        // Utility animations
        grid: "grid 150s linear infinite",
        "slide-in": "fade-in-up 0.5s ease-out",
        "double-blink":
          "doubleBlink 1.2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite",
      },

      // Custom border radius using CSS variables for consistency
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // Brand colors
      colors: {
        "custom-yellow": "rgb(255, 213, 122)",
        "custom-dark-blue": "rgb(0, 44, 63)",
        "custom-light-gray": "rgb(201, 202, 202)",
        "custom-dark-gray": "rgb(161, 161, 170)",
      },

      // Custom shadow effects for light/dark mode
      boxShadow: {
        "dark-shadow": "rgba(0, 0, 0, 1) 0px 0px 8px",
        "white-shadow": "rgba(255, 255, 255, 1) 0px 0px 8px",
        "hover-white-shadow": "rgba(255, 255, 255, 0.8) 0px 0px 32px",
        "hover-dark-shadow": "rgba(0, 0, 0, 0.8) 0px 0px 32px",
      },

      // Keyframe definitions for custom animations
      keyframes: {
        // Basic fade in animation
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        // Floating animation with scale effect
        float: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "50%": { transform: "translateY(-20px) scale(1.2)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
        },

        // Various falling animations
        fall: {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        drop: {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },

        // Complex leaf falling animation with rotation
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

        // Basic spin animation
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },

        // Grid movement animation
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },

        // Orbit path animations with different radiuses
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

        // Double blink animation with scale effect
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

      // 3D perspective value
      perspective: {
        1000: "1000px",
      },

      // Custom z-index scale
      zIndex: {
        10000: "10000",
        1000: "1000",
        900: "900",
        800: "800",
        700: "700",
        600: "600",
        500: "500",
      },
    },
  },

  // Tailwind plugins
  plugins: [
    // Enable basic animation utilities
    require("tailwindcss-animate"),
    // Add HeroUI components
    heroui(),
    // Custom utility to remove tap highlight on mobile
    function ({ addUtilities }) {
      addUtilities({
        ".no-tap-highlight": {
          "-webkit-tap-highlight-color": "transparent",
        },
      });
    },
  ],
};
