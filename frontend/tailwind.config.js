/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', "Geist", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        // Neutros com matiz índigo (substituem o zinc padrão em todo o app)
        zinc: {
          50: "#f5f6ff", 100: "#e9eaf8", 200: "#d3d5ec", 300: "#b0b4d2", 400: "#8a8fb3",
          500: "#646a91", 600: "#474c70", 700: "#303454", 800: "#222544", 900: "#171a33", 950: "#0d0f20",
        },
        // IA: sintético, elétrico
        ai: {
          300: "#bdb5ff", 400: "#a195ff", 500: "#8b7cff", 600: "#6f5df0", 700: "#5645d1",
        },
        // Real: analógico, quente
        real: {
          300: "#ffd592", 400: "#ffc266", 500: "#ffb454", 600: "#f59e2b", 700: "#d17f10",
        },
      },
    },
  },
  plugins: [],
}
