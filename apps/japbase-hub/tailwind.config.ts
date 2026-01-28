/**
 * @app japbase-hub
 * @file tailwind.config.ts
 * 
 * Configuração do Tailwind CSS para o JapBase Hub.
 * Usa o Design System Japurá 2025 definido em packages/ui.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // Incluir componentes do Design System
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
          primary: '#3E3F40', // Cor primária (pode ser ajustada)
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'japura': '12px',
      },
    },
  },
  plugins: [],
};

export default config;
