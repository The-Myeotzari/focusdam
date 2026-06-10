/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-strong": "var(--bg-strong)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        surface: "var(--surface)",
        "surface-border": "var(--surface-border)"
      },
      boxShadow: {
        soft: "var(--shadow)"
      },
      borderRadius: {
        xl2: "var(--radius-xl)",
        lg2: "var(--radius-lg)",
        md2: "var(--radius-md)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      }
    }
  },
  plugins: []
};
