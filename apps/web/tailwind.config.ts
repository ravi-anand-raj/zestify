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
        background: '#000000',
        foreground: '#FFFFFF',
        primary: {
          DEFAULT: '#0A84FF',
          foreground: '#FFFFFF',
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
        },
        destructive: {
          DEFAULT: '#FF453A',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#FF9F0A',
          foreground: '#000000',
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
