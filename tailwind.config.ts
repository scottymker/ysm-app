import type { Config } from "tailwindcss";
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/styles/**/*.{ts,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0EA5E9",
        ink: "#111111",
        surface: { light: "#F8FAFC", dark: "#0B1220" },
        divider: "#E5E7EB"
      },
      borderRadius: { xl: "0.9rem", "2xl": "1.25rem" }
    }
  },
  plugins: []
} satisfies Config;
