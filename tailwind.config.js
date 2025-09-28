/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // if you have a second app folder, keep these:
    './youstillmatter-app/src/**/*.{js,ts,jsx,tsx,mdx}',
    './youstillmatter-app/app/**/*.{js,ts,jsx,tsx,mdx}',
    './youstillmatter-app/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)',
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        card: 'var(--card)',
        border: 'var(--border)',
        focus: 'var(--focus)',
        accent: 'var(--accent)',
        'accent-weak': 'var(--accent-weak)',
        muted: 'var(--muted)',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
      },
      borderRadius: { xl: '16px', '2xl': '20px' },
      boxShadow: { card: '0 10px 20px rgba(0,0,0,.06)' },
    },
  },
  plugins: [],
};
