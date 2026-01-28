/**
 * @app japimport
 * @file supabaseClient.ts
 * 
 * Cliente Supabase específico do sistema JapImport.
 * 
 * Cada sistema possui seu próprio cliente Supabase apontando para
 * seu próprio projeto Supabase (banco PostgreSQL isolado).
 * 
 * IMPORTANTE: Este arquivo NÃO deve ser alterado sem autorização explícita.
 * É a base de todas as conexões do JapImport com o Supabase.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials não configuradas. Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.warn('URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada');
  console.warn('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada');
} else {
  console.log('✅ Supabase configurado:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});
