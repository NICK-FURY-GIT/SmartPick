/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'accent-cyan': '#00E5FF',
        'accent-amber': '#FFD600',
      },
      backgroundColor: {
        base: '#0A0A0F',
      },
    },
  },
  plugins: [],
}
