const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors inspired by Yovo's site
        primary: {
          DEFAULT: '#1E1E1E',
          dark: '#0A0A0A',
          light: '#2A2A2A',
        },
        secondary: {
          DEFAULT: '#252525',
          dark: '#1A1A1A',
          light: '#303030',
        },
        accent: {
          DEFAULT: '#00D9FF',
          cyan: '#00D9FF',
          blue: '#4D94FF',
          purple: '#B968C7',
          green: '#50FA7B',
        },
        text: {
          primary: '#F8F8F2',
          secondary: '#B2B2B2',
          muted: '#6D6D6D',
          code: '#50FA7B',
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #1E1E1E 0%, #0A0A0A 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00D9FF 0%, #4D94FF 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0, 217, 255, 0.3)',
        'glow': '0 0 20px rgba(0, 217, 255, 0.4)',
        'glow-lg': '0 0 30px rgba(0, 217, 255, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
