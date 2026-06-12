import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050508',
        foreground: '#F5F5F7',
        primary: {
          DEFAULT: '#0A84FF',
          foreground: '#FFFFFF',
          50: '#E6F1FF',
          100: '#B8D7FF',
          200: '#8ABDFF',
          300: '#5CA3FF',
          400: '#2E89FF',
          500: '#0A84FF',
          600: '#006ADB',
          700: '#0050B7',
          800: '#003693',
          900: '#001C6F',
        },
        secondary: {
          DEFAULT: '#1C1C1E',
          foreground: '#EBEBF5',
        },
        card: {
          DEFAULT: '#1C1C1E',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#2C2C2E',
          foreground: '#EBEBF5',
        },
        accent: {
          DEFAULT: '#30D158',
          foreground: '#000000',
          50: '#E8FAED',
          100: '#B5EFC2',
          200: '#82E497',
          300: '#4FD96C',
          400: '#30D158',
          500: '#22B94A',
          600: '#1A993C',
          700: '#12792E',
          800: '#0A5920',
          900: '#023912',
        },
        destructive: {
          DEFAULT: '#FF453A',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#FF9F0A',
          foreground: '#000000',
        },
        success: {
          DEFAULT: '#30D158',
          foreground: '#000000',
        },
        info: {
          DEFAULT: '#5AC8FA',
          foreground: '#000000',
        },
        border: '#FFFFFF0D',
        input: '#FFFFFF0D',
        ring: '#0A84FF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(10,132,255,0.15)',
        'glow-accent': '0 0 20px rgba(48,209,88,0.15)',
        'glow-warning': '0 0 20px rgba(255,159,10,0.15)',
        'glow-destructive': '0 0 20px rgba(255,69,58,0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)',
        'elevated': '0 8px 30px rgba(0,0,0,0.5)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'counter-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(10,132,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(10,132,255,0.6)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'counter-up': 'counter-up 0.4s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
