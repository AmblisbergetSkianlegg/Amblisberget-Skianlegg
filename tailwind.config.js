/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1c3d5a',
          hover: '#2c5a8f',
        },
        secondary: '#e8f0f7',
        accent: '#ff4d4d',
      },
      spacing: {
        'header': '3.75rem',
        'header-tablet': '3.125rem',
        'header-mobile': '2.8125rem',
      },
      boxShadow: {
        'sm': '0 0.125rem 0.25rem rgba(0,0,0,0.1)',
        'md': '0 0.125rem 0.5rem rgba(0,0,0,0.15)',
      },
      fontFamily: {
        'sans': ['"Noto Sans"', 'sans-serif'],
      },
      fontSize: {
        'xxs': '0.6rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
