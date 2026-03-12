import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sidebar: {
          DEFAULT: '#0d2137',
          foreground: '#ffffff',
          accent: 'rgba(255,255,255,0.1)',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

