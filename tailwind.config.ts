import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./youstillmatter-app/src/**/*.{ts,tsx,js,jsx,mdx}",
    "./youstillmatter-app/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./youstillmatter-app/components/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)", bg: "var(--bg)", fg: "var(--fg)",
        card: "var(--card)", border: "var(--border)", focus: "var(--focus)",
        accent: "var(--accent)", "accent-weak": "var(--accent-weak)",
        muted: "var(--muted)", ok: "var(--ok)", warn: "var(--warn)", danger: "var(--danger)",
      },
      borderRadius: { xl: "16px", "2xl": "20px" },
      boxShadow: { card: "0 10px 20px rgba(0,0,0,.06)" },
    },
  },
  plugins: [],
};
export default config;
