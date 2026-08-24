/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: '#F6F5F1', surface: '#FFFFFF', ink: '#1B1D22', slate: '#666B75', line: '#E4E2DC',
        cobalt: { DEFAULT: '#2A4CDB', dark: '#1E39B0', light: '#6C86FF' },
        amber: { DEFAULT: '#E8A33D', light: '#F0B65C' },
        mint: { DEFAULT: '#1F9D66', light: '#3DBE86' },
        rose: { DEFAULT: '#D64545', light: '#F16565' },
        inkdark: '#14161A', surfacedark: '#1D2027', linedark: '#2C2F37', slatedark: '#9A9EA8', paperdark: '#F1F0EC'
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace']
      },
      borderRadius: { xs: '4px', sm: '6px', md: '10px', lg: '16px', xl: '24px', '2xl': '32px' },
      boxShadow: {
        xs: '0 1px 2px rgba(27,29,34,0.05)', sm: '0 2px 10px rgba(27,29,34,0.06)',
        md: '0 10px 30px rgba(27,29,34,0.08)', lg: '0 20px 50px rgba(27,29,34,0.14)',
        glow: '0 0 0 4px rgba(42,76,219,0.15)'
      }
    }
  },
  plugins: [],
}
