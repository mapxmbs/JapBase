-- ============================================
-- Configurar schema japbase para PostgREST
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Garantir que o schema existe
CREATE SCHEMA IF NOT EXISTS japbase;

-- 2. Conceder permissões ao schema
GRANT USAGE ON SCHEMA japbase TO anon, authenticated, service_role;

-- 3. Conceder permissões em todas as tabelas existentes
GRANT ALL ON ALL TABLES IN SCHEMA japbase TO anon, authenticated, service_role;

-- 4. Conceder permissões em rotinas (funções)
GRANT ALL ON ALL ROUTINES IN SCHEMA japbase TO anon, authenticated, service_role;

-- 5. Conceder permissões em sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA japbase TO anon, authenticated, service_role;

-- 6. Configurar permissões padrão para novas tabelas
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA japbase 
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA japbase 
  GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA japbase 
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 7. Atualizar configuração do PostgREST para incluir japbase
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, japbase';

-- 8. Recarregar o cache do PostgREST
NOTIFY pgrst, 'reload schema';

-- ============================================
-- IMPORTANTE: Depois de executar este script,
-- vá em Project Settings → API → Exposed schemas
-- e adicione "japbase" manualmente na lista
-- ============================================
