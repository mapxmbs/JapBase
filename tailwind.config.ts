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
        jap: {
          black: '#000000',      // Fundo Sidebar
          graphite: '#3E3F40',   // Fundo Cards
          silver: '#827f7f',     // Bordas
          offwhite: '#f0efee',   // Fundo Fundo Tela
          white: '#ffffff',      // Texto
        },
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
