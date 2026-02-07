import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        japura: {
          bg: '#f0efee',
          black: '#000000',
          dark: '#3E3F40',
          grey: '#827f7f',
          white: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'japura': '4px',
        'japura-sm': '2px',
      },
    },
  },
  plugins: [],
};

export default config;
