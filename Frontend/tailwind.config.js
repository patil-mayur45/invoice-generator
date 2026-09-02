/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#4F46E5", dark: "#4338CA" },
        secondary: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        surface: "#FFFFFF",
        bg: "#F8FAFC",
        textPrimary: "#1E293B",
        textSecondary: "#64748B",
        borderColor: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(30, 41, 59, 0.08), 0 1px 2px rgba(30, 41, 59, 0.06)",
        cardHover: "0 8px 24px rgba(30, 41, 59, 0.12)",
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};
