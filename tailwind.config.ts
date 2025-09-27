import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        bg: "var(--bg)",
        fg: "var(--fg)",
        card: "var(--card)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-weak": "var(--accent-weak)",
        focus: "var(--focus)",
        muted: "var(--muted)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      borderRadius: { xl: "16px", "2xl": "20px" },
      boxShadow: { card: "0 10px 20px rgba(0,0,0,.06)" },
    },
  },
  plugins: [],
};

export default config;
