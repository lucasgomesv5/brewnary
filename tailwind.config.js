/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3C2F2F', 
          light: '#F6E9D7',   
          dark: '#241D1B',    
        },
        muted: '#c9b8ae',
        accent: '#c37c5f',
        text: {
          DEFAULT: '#1E1E1E',
          light: '#1E1E1E',
          dark: '#EDEDED',
        },
        background: {
          light: '#f6ede4',
          dark: '#1E1A16',
        },
      },
    },
  },
  plugins: [],
}

