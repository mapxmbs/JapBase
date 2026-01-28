/**
 * @app japbase-hub
 * @file next.config.ts
 * 
 * Configuração do Next.js para o JapBase Hub (Shell/Orquestrador).
 * 
 * O Hub é responsável por orquestrar e apresentar os módulos do JapBase
 * como uma única plataforma unificada.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
