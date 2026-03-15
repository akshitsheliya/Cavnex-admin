export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#000000",
          800: "#0a0a0a",
          700: "#111111",
          600: "#1a1a1a",
          500: "#222222",
          400: "#2a2a2a",
          300: "#333333",
          200: "#444444",
          100: "#555555",
        },
        neon: {
          green: "#00ff88",
          blue: "#00d4ff",
          purple: "#8b5cf6",
          pink: "#ec4899",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.05)",
          dark: "rgba(0, 0, 0, 0.5)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)",
        "gradient-neon-reverse":
          "linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)",
        "gradient-purple": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        "gradient-dark": "linear-gradient(180deg, #0a0a0a 0%, #000000 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 255, 136, 0.3)",
        "neon-blue": "0 0 20px rgba(0, 212, 255, 0.3)",
        "neon-strong": "0 0 30px rgba(0, 255, 136, 0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 25px 50px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        gradient: "gradient 8s ease infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
