/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./assets/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'theme-bg': 'var(--bg-color)',
        'theme-card': 'var(--card-color)',
        'theme-text': 'var(--text-color)',
        'theme-text-muted': 'var(--text-muted-color)',
        'theme-border': 'var(--border-color)',
        'theme-primary': 'var(--primary-color)',
        'theme-primary-text': 'var(--primary-text-color)',
        'theme-tab': 'var(--tab-color)',
        'theme-primary-bg': 'var(--primary-bg-color)',
      },
    },
  },
  plugins: [],
}