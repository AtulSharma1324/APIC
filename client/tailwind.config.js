/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7f4',
          100: '#ffece5',
          200: '#ffd4c7',
          300: '#ffb099',
          400: '#ff8666',
          500: '#ff6b4a',
          600: '#f04e2b',
          700: '#cc3718',
          800: '#a32b12',
          900: '#6e1d0c',
          950: '#420f06',
        },
        sunset: {
          50: '#fff8f5',
          100: '#feece5',
          200: '#fdd3c5',
          300: '#fbab98',
          400: '#f7775e',
          500: '#ee4b2b',
          600: '#dc2f16',
          700: '#b8200d',
          800: '#941e11',
          900: '#791d14',
          peach: '#FF9E7D',
          coral: '#FF6B52',
          orange: '#FF8A65',
          amber: '#FFCC80',
          yellow: '#FFD54F',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a0e1a',
        }
      }
    },
  },
  plugins: [],
}
