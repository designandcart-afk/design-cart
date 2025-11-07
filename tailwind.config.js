/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#d96857',
        'brand-text': '#2e2e2e',
        'brand-bg': '#f2f0ed'
      },
      borderRadius: {
        'xl2': '1.25rem'
      },
      boxShadow: {
        'soft': '0 6px 20px rgba(0,0,0,0.07)'
      }
    }
  },
  plugins: []
}
