import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        border: "var(--border)",
        muted: "var(--muted)",
        emerald: {
          DEFAULT: "#0B3D2E",
          50: "#e9f2ee",
          100: "#c7dcd2",
          200: "#8fbaa6",
          300: "#57977a",
          400: "#2f6f52",
          500: "#0B3D2E",
          600: "#093122",
          700: "#07271b",
          800: "#051d14",
          900: "#03130d",
        },
        gold: {
          DEFAULT: "#D4AF37",
          50: "#fbf6e7",
          100: "#f5e8bf",
          200: "#ecd383",
          300: "#e3bf4a",
          400: "#D4AF37",
          500: "#b7942a",
          600: "#8f7220",
          700: "#665117",
          800: "#3d310e",
          900: "#141005",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(0,0,0,0.25)",
        glow: "0 0 40px -8px rgba(212,175,55,0.45)",
        "glow-sm": "0 0 20px -6px rgba(212,175,55,0.4)",
        card: "0 20px 60px -20px rgba(11,61,46,0.35)",
      },
      backgroundImage: {
        "ornament":
          "radial-gradient(circle at 1px 1px, rgba(212,175,55,0.12) 1px, transparent 0)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-pan": "gradient-pan 12s ease infinite",
        ripple: "ripple 0.6s linear",
      },
    },
  },
  plugins: [],
};
export default config;
