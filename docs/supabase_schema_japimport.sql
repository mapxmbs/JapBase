-- Schema esperado pelo JapImport (backend em src/services/pimpsService.ts).
-- Use este SQL no Supabase (SQL Editor ou migrações) e exponha o schema "import" em Settings > API > Schemas.

CREATE SCHEMA IF NOT EXISTS import;

-- PIMPs (processos de importação)
CREATE TABLE IF NOT EXISTS import.pimps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pimp_numero VARCHAR(50) NOT NULL,
  exporter VARCHAR(255) NOT NULL,
  proforma VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  order_date DATE,
  eta DATE,
  arrival_date DATE,
  valor_total_usd DECIMAL(15,2),
  valor_frete_usd DECIMAL(15,2),
  origem VARCHAR(50) DEFAULT 'excel',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produtos por PIMP
CREATE TABLE IF NOT EXISTS import.pimps_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pimp_id UUID NOT NULL REFERENCES import.pimps(id) ON DELETE CASCADE,
  codigo_produto VARCHAR(100),
  descricao VARCHAR(500),
  quantidade INTEGER,
  valor_unitario_usd DECIMAL(15,2),
  valor_unitario_brl DECIMAL(15,2),
  valor_total_usd DECIMAL(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trânsito por PIMP (um registro por PIMP)
CREATE TABLE IF NOT EXISTS import.pimps_transito (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pimp_id UUID UNIQUE NOT NULL REFERENCES import.pimps(id) ON DELETE CASCADE,
  carrier VARCHAR(255),
  agent VARCHAR(255),
  container VARCHAR(100),
  invoice_numero VARCHAR(100),
  status_averbacao VARCHAR(100),
  arrival_port_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pimps_status ON import.pimps(status);
CREATE INDEX IF NOT EXISTS idx_pimps_exporter ON import.pimps(exporter);
CREATE INDEX IF NOT EXISTS idx_pimps_produtos_pimp ON import.pimps_produtos(pimp_id);
CREATE INDEX IF NOT EXISTS idx_pimps_transito_pimp ON import.pimps_transito(pimp_id);

-- RLS (opcional): descomente se usar auth
-- ALTER TABLE import.pimps ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE import.pimps_produtos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE import.pimps_transito ENABLE ROW LEVEL SECURITY;
