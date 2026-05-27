/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"]
      },
      colors: {
        ink: "#172026",
        brand: {
          50: "#ecfdf7",
          100: "#d0f7ea",
          500: "#10b981",
          600: "#0f9f7d",
          700: "#0d8067",
          900: "#064236"
        },
        coral: "#f97362",
        gold: "#f5bd4f"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(15, 23, 42, 0.16)",
        soft: "0 18px 55px rgba(13, 128, 103, 0.14)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.6s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.75", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" }
        }
      }
    }
  },
  plugins: []
};
