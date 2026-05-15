import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dk: {
          950: "#030711",
          900: "#070b14",
          800: "#0c1220",
          700: "#111b2e",
          600: "#162038",
          500: "#1c2844",
        },
        ac: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          green: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          purple: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-sc)", "system-ui", "sans-serif"],
      },
      animation: {
        "orb-float": "orbFloat 25s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        orbFloat: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(40px, -50px) scale(1.08)" },
          "50%": { transform: "translate(-30px, 40px) scale(0.92)" },
          "75%": { transform: "translate(20px, 20px) scale(1.04)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59,130,246,0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(59,130,246,0.25)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
