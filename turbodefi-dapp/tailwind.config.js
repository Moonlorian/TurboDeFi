/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif']
      },
      colors:{
        'main-color': '#ff0080',
        'secondary-color': '#6c757d',
        'bg-color': '#ffffff',
        'text-color': '#343a40',
        'cards-bg-color': '#f8f9fa',
        'cta-text-color': '#ffffff',
        'alert-bg-color': '#dc3545',
        'border-color': 'red'
      }
    },
    backgroundImage: {
      // eslint-disable-next-line quotes
      'mvx-white': "url('../multiversx-white.png')"
    }
  },
  plugins: []
};
