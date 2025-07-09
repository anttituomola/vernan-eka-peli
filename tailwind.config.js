/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#fce3ff',
          300: '#f9d0ff',
          400: '#f3b0ff',
          500: '#eb86ff',
          600: '#d946ef',
          700: '#c026d3',
          800: '#9d1bb0',
          900: '#831b94',
        },
        kidBlue: '#4ECDC4',
        kidGreen: '#95E1A3',
        kidYellow: '#FFE66D',
        kidOrange: '#FF8C42',
        kidPurple: '#B8B8FF',
        kidPink: '#FF9EC7',
        kidRed: '#FF6B6B',
      },
      fontFamily: {
        'kid': ['Comic Sans MS', 'cursive', 'sans-serif'],
      },
      fontSize: {
        'kid-xl': '2rem',
        'kid-2xl': '3rem',
        'kid-3xl': '4rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'kid': '20px',
        'kid-lg': '30px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}