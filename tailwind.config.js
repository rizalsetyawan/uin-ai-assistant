/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: "#040d0c",
          darker: "#061513",
          dark: "#081d19",
          card: "#0a231f",
          cardBorder: "#123932",
          cardBorderHover: "#1c544a",
          emerald: "#10b981",
          emeraldLight: "#34d399",
          emeraldDim: "#064e3b",
          accentYellow: "#f59e0b"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}

