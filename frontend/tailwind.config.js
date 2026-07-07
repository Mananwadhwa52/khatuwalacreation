/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#570000',
        'primary-dark': '#3d0000',
        'primary-light': '#800000',
        gold: '#D4AF37',
        'gold-light': '#F1D37E',
        'gold-dark': '#B8860B',
        cream: '#FAF6F0',
        'cream-dark': '#F0EAE0',
        muted: '#5a413d',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
