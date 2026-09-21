/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        karpathy: {
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          accent: '#2f81f7',
          cyan: '#38bdf8',
          amber: '#f59e0b',
          emerald: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
