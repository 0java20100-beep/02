import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        watermelon: {
          50: "#fff1f4",
          100: "#ffe0e7",
          200: "#ffc6d3",
          300: "#ff9bb1",
          400: "#ff6088",
          500: "#fb2c5a",
          600: "#e80f45",
          700: "#c30739",
          800: "#a30936",
          900: "#8a0d34",
          950: "#4d0117",
        },
        leaf: {
          50: "#ecfdf3",
          100: "#d2f9e0",
          200: "#a8f1c6",
          300: "#6fe3a6",
          400: "#34cd81",
          500: "#10b366",
          600: "#059152",
          700: "#047444",
          800: "#075c39",
          900: "#074b30",
          950: "#022c1a",
        },
        gold: {
          400: "#f0c674",
          500: "#e2ad4c",
          600: "#c8902f",
        },
        ink: {
          50: "#f5f6f8",
          100: "#e8eaf0",
          800: "#161b29",
          900: "#0c111d",
          950: "#070a12",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(251, 44, 90, 0.45)",
        soft: "0 20px 60px -20px rgba(12, 17, 29, 0.35)",
        card: "0 10px 40px -12px rgba(12, 17, 29, 0.18)",
      },
      backgroundImage: {
        "watermelon-gradient":
          "linear-gradient(135deg, #fb2c5a 0%, #ff6088 45%, #10b366 130%)",
        "premium-radial":
          "radial-gradient(80% 80% at 50% 0%, rgba(251,44,90,0.12) 0%, rgba(255,255,255,0) 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.12) translate(-1.5%, -1.5%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "ken-burns": "ken-burns 12s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
