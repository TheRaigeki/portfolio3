/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        base: "#0C0C0E",
        surface: "#141518",
        surface2: "#191A1E",
        line: "#232428",
        "line-soft": "#1c1d21",
        fg: "#E7E5E1",
        muted: "#8A8A82",
        dim: "#5f5f59",
        accent: "#FFB020",
        "accent-deep": "#E8920E",
        ok: "#3FB950",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
};
