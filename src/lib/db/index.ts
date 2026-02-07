/**
 * lib/db – Camada de acesso a dados
 *
 * Concentra conexões com banco de dados.
 * JapImport (Bounded Context) usa japbase schema.
 *
 * Estratégia: PostgreSQL direto como primário (contorna PGRST002),
 * Supabase/PostgREST como fallback quando disponível.
 */

export { queryPostgres, getPostgresPool } from './postgres'
export { getSupabaseServer } from './supabase'
