export default {
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 여기에 해당 css 파일도 포함되어야 함
    "./src/styles/**/*.css", // 예: CSS 경로가 따로 있다면 명시
  ],
  theme: {
    screens: {
      xs: "480px",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    extend: {
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
        tossface: ["Tossface", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#F5F7F9",
          100: "#E3E7EC",
          200: "#C6CEDA",
          300: "#A7B3C5",
          400: "#8897B0",
          500: "#6A7C9B",
          600: "#566481",
          700: "#434C66",
          800: "#2F344C",
          900: "#121627",
          990: "#0A0E19",
        },
        secondary: {
          50: "#FFF8ED",
          100: "#FFF3E0",
          200: "#FFE0B2",
          300: "#FFCC80",
          400: "#FFB74D",
          500: "#FFA726",
          600: "#FB8C00",
          700: "#EF6C00",
          800: "#E65100",
          900: "#A63A00",
        },
        gray: {
          50: "#F7FAFC",
          100: "#EDF2F7",
          200: "#E2E8F0",
          300: "#CBD5E0",
          400: "#A0AEC0",
          500: "#718096",
          600: "#4A5568",
          700: "#2D3748",
          800: "#1A202C",
          900: "#171923",
        },
        textPrimary: "#1A1A1A",
        danger: "#D32F2F",
        warning: "#F57C00",
        info: "#0288D1",
        success: "#388E3C",
        "danger-light": "#F9D6D5",
        "warning-light": "#FFE0B2",
        "info-light": "#B3E5FC",
        "success-light": "#C8E6C9",
        emphasis: "#E3D026",
      },
      keyframes: {
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        shine: {
          "0%": { "background-position": "100%" },
          "100%": { "background-position": "-100%" },
        },
      },
      animation: {
        "flash-fast": "flash 1s ease-in-out infinite",
        shine: "shine 5s linear infinite",
      },
    },
    boxShadow: {
      "custom-light":
        "2px 4px 12px rgba(0, 0, 0, 0.2), -2px -2px 12px rgba(255, 255, 255, 0.3)",
      "custom-dark":
        "2px 4px 16px rgba(0, 0, 0, 0.05), -2px -2px 16px rgba(255, 255, 255, 0.01)",
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
