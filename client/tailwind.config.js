/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#8A9A86',
          light: '#EBF0EA',
          muted: '#72816E',
          dark: '#586555',
        },
        sand: {
          DEFAULT: '#E5D9C5',
          light: '#F8F4EE',
          dark: '#C8BAA3',
        },
        terracotta: {
          DEFAULT: '#C88A75',
          light: '#F6EAE6',
          dark: '#A66B58',
        },
        cream: {
          DEFAULT: '#FAF8F5',
          soft: '#F4F0E8',
          card: '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#2B2D2F',
          muted: '#63676B',
          light: '#93979B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Montserrat"', '"Inter"', 'sans-serif'],
        script: ['"Playfair Display"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(43, 45, 47, 0.05)',
        'elevated': '0 10px 30px -4px rgba(43, 45, 47, 0.08)',
        'luxury': '0 20px 40px -10px rgba(138, 154, 134, 0.15)',
      },
    },
  },
  plugins: [],
}
