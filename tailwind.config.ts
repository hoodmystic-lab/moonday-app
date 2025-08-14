import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg1: '#2b1d47',
        bg2: '#0b0f14',
        accent: '#e6e6e6',
        ring: 'rgba(255,255,255,.12)'
      }
    },
  },
  plugins: [],
} satisfies Config
