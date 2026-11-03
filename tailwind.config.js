/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: "#060607",
          card: "#0d0d10",
          cardHover: "#131317",
          surface: "#18181e",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.22)",
          gold: "#d4af37",
          goldLight: "#f3e5ab",
          platinum: "#e2e8f0",
          muted: "#8e8e99",
          dim: "#4a4a55",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
        heading: ['"Syne"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.08em",
        wider: "0.15em",
        widest: "0.25em",
        ultra: "0.38em",
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 40px -10px rgba(255, 255, 255, 0.15)',
        'glow-gold': '0 0 30px -5px rgba(212, 175, 55, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
};
