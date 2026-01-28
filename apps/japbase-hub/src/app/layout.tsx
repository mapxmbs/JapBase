/**
 * @app japbase-hub
 * @file layout.tsx
 * 
 * Layout raiz do JapBase Hub (Shell/Orquestrador).
 * 
 * O Hub é responsável por:
 * - Layout unificado (Sidebar, Header)
 * - Navegação entre módulos
 * - Autenticação centralizada
 * - Orquestração de módulos como componentes de integração
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Japurá Pneus | Dashboard",
  description: "Sistema de Gestão Integrada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
