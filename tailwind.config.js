/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'theme-pink': '#ff69b4',
        'theme-pink-light': 'rgba(255, 105, 180, 0.5)',
        'theme-pink-dark': '#cc4f8f',
        'theme-pink-accessible': '#b91c5c',
        'theme-purple': '#9370db',
        'theme-purple-light': 'rgba(147, 112, 219, 0.5)',
        'theme-purple-dark': '#6b4fa3',
      },
      animation: {
        'gradient-shift': 'gradientAnimation 3s ease infinite',
      },
      keyframes: {
        gradientAnimation: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
} 