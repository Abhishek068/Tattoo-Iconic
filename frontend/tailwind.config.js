/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f6f7",
          100: "#e5e6eb",
          200: "#cacad3",
          300: "#a3a4b2",
          400: "#747688",
          500: "#555767",
          600: "#414352",
          700: "#323340",
          800: "#22232c",
          900: "#14151b",
          950: "#0b0c10",
        },
        brand: {
          DEFAULT: "#c8553d",
          light: "#e07a5f",
          dark: "#9e3c28",
          accent: "#ff7a59",
        },
        gold: {
          300: "#f6e05e",
          400: "#ecc94b",
          DEFAULT: "#d4af37",
          600: "#b78a1f",
          700: "#916a12",
        },
        cream: "#faf8f5",
        surface: {
          dark: "#121319",
          card: "#181922",
          elevated: "#21232e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Outfit", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Cinzel", "Playfair Display", "Georgia", "serif"],
      },
      maxWidth: {
        content: "1440px",
        hero: "1560px",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(200, 85, 61, 0.3)",
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.25)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
