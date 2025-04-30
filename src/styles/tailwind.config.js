/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // Enable dark mode using class strategy
    theme: {
      extend: {
        colors: {
          light: {
            background: '#fefefe',
            text: '#1a1a1a',
            card: '#ffffff',
            accent: '#2563eb', // blue
          },
          dark: {
            background: '#0f172a',
            text: '#f1f5f9',
            card: '#1e293b',
            accent: '#38bdf8', // sky
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
          display: ['"Playfair Display"', 'serif'],
        },
        boxShadow: {
          creative: '0 4px 20px rgba(0, 0, 0, 0.1)',
          creativeDark: '0 4px 20px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    plugins: [],
  }
  