/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#0f0',
          cyan: '#0ff',
        },
        dark: {
          bg: '#050505',
          card: '#111111',
        }
      },
      animation: {
        'grid': 'grid 20s linear infinite',
      },
      keyframes: {
        grid: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(30px)' },
        }
      }
    },
  },
  plugins: [],
}
