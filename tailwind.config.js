/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",   
    "./components/**/*.{js,jsx,ts,tsx}", 
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}",   
    "./screens/**/*.{js,jsx,ts,tsx}",  
    "./assets/**/*.{js,jsx,ts,tsx}",   
  ],  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       colors: {
        // Define custom colors that use CSS custom properties
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          text: 'rgb(var(--color-primary-text) / <alpha-value>)',
          bg: 'rgb(var(--color-primary-bg) / <alpha-value>)',
        },
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        text: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        tab: 'rgb(var(--color-tab) / <alpha-value>)',
      },
    },
  },
  plugins: [
      ({ addBase }) => addBase({
      ':root': {
        '--color-primary': '124 58 237', // default violet-600
        '--color-primary-light': '139 92 246',
        '--color-primary-dark': '109 40 217',
        '--color-primary-text': '124 58 237',
        '--color-primary-bg': '245 243 255',
        '--color-bg': '249 250 251',
        '--color-card': '255 255 255',
        '--color-text': '31 41 55',
        '--color-text-muted': '107 114 128',
        '--color-border': '229 231 235',
        '--color-tab': '229 231 235',
      },
    }),
  ],
}