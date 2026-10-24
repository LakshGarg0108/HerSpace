/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#FAF7FC',
        surface: {
          DEFAULT: '#FFFFFF',
          lavender: '#EEE8F7',
          cream: '#FFF9F0',
          sage: '#DCE9DE',
          muted: '#F4F0F9',
        },
        lavender: {
          50: '#F7F4FB',
          100: '#EEE8F7',
          200: '#DDD1EF',
          300: '#C2AFE3',
          400: '#A48ED0',
          500: '#8B78B8', // Primary lavender
          600: '#7563A2',
          700: '#655486', // Deep lavender
          800: '#52446D',
          900: '#3D3352',
        },
        cream: {
          DEFAULT: '#FFF9F0',
          100: '#FFFDF9',
          200: '#FFF9F0',
          300: '#FDF2E2',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E8EFE8',
          200: '#DCE9DE',
          300: '#C4DAC7',
          500: '#7E9B83',
          700: '#536D58',
        },
        rose: {
          50: '#FDF6F7',
          100: '#F9EBEF',
          200: '#F3D6DE',
          300: '#E5AAB9',
          400: '#D58298',
          500: '#BA5D76',
        },
        content: {
          primary: '#302A38',
          secondary: '#797181',
          muted: '#9D96A5',
          light: '#BAAEBF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(101, 84, 134, 0.06)',
        'soft-md': '0 8px 30px -4px rgba(101, 84, 134, 0.08)',
        'soft-lg': '0 12px 40px -6px rgba(101, 84, 134, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(101, 84, 134, 0.04)',
      },
      animation: {
        'gentle-pulse': 'gentlePulse 4s ease-in-out infinite',
        'breathe-in': 'breatheIn 4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'breathe-out': 'breatheOut 6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        gentlePulse: {
          '0%, 100%': { opacity: '0.92', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
