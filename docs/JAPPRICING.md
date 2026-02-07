# JapPricing — Módulo Unificado de Preços

**Objetivo:** Centralizar formação, validação, auditoria e governança de preços em um único módulo. Substituir planilhas manuais e eliminar cruzamento de dados externos.

---

## Motor de Preços (Protótipo Executivo)

O **Motor de Preços** é a primeira aba do JapPricing, focada em **demonstração executiva** da lógica de precificação definida nas reuniões 02-03 e 02-04.

### Funcionalidades

- **Dashboard:** Total de produtos, estados cobertos, canais ativos, categorias, % shopping ativo, total de exceções
- **Grid principal:** Código, descrição, categoria, NCM, origem (quando Pará), estado, cidade, canal, custo Manaus, markup explícito, preço final, estoque, shopping ativo/inativo, média concorrência, status (ok/acima/abaixo)
- **Filtros:** Estado, cidade, canal, categoria, origem (visível apenas quando Estado = Pará), shopping ativo/inativo, apenas exceções
- **Detalhe do produto:** Formação passo a passo (custo base, fator, regra, preço final), bloco shopping com concorrentes, toggle shopping, exceções
- **Mock IA:** Preço atual, preço de mercado, preço sugerido (simulado), botões Manter / Ajustar / Registrar exceção

### Regras de Negócio (Motor)

- **Custo base:** CISPRO Manaus é a base de todos os cálculos
- **Canais:** Varejo (mais caro), Frota (intermediário), Atacado (mais barato)
- **Estados/cidades:** Amazonas (Manaus), Roraima (Boa Vista), Acre (Rio Branco), Amapá (Macapá), Rondônia (Porto Velho, Ariquemes, Ji-Paraná, Vilhena), Pará (Belém, Santarém, Parauapebas)
- **Categorias:** Passeio, Caminhonete, SUV, Carga, Agrícola, OTR, Câmara de Ar
- **Origem (apenas Pará):** Nacional, Nacionalizado, Importado
- **Markups:** Por estado, cidade, canal, categoria e origem — ver `src/services/jappricing/motorEngine.ts`

---

## Visão Geral

O JapPricing é o módulo exclusivo da diretoria para:
- **Formar** preços (custo SISPRO, estoque, PIMP, margem)
- **Validar** com o mercado (Shopping de Preços)
- **Auditar** faturamento e divergências
- **Governar** parâmetros e regras
- **Rastrear** histórico e logs

---

## Estrutura de Abas

| Aba | Conteúdo |
|-----|----------|
| **Motor** | Protótipo executivo: dashboard, grid principal com markups explícitos, filtros avançados, detalhe do produto, mock IA. Regras 02-03/02-04. |
| **Formação** | Grid estilo Excel: produto, medida, estado, canal, custo SISPRO, estoque, trânsito, preço sugerido/aprovado, status. Motor de sugestão, aprovação, exportação para operação. |
| **Shopping** | JapMarket integrado: comparação nosso preço × concorrentes, upload Excel/CSV, filtros, KPIs, pintura de linhas, Dashboard 360, exportação. |
| **Auditoria** | Faturado × combinado, divergências, aprovação/reprovação, status, exportação para cobrança. |
| **Parâmetros** | Fatores regionais, impostos por NCM, categorias de produto, regras de cálculo (V1: mock, persistência em evolução). |
| **Histórico** | Log de alterações de preços: anterior, novo, data, usuário, motivo. |

---

## Fluxo de Dados (Conceitual)

```
SISPRO (custo, estoque) ──┐
PIMPs (trânsito) ─────────┤
                          ├──► Formação ──► Preço aprovado ──► Shopping (Nosso Preço)
Invoices / Manual ────────┘
                                                                    │
Concorrentes (upload) ─────────────────────────────────────────────┘
                                                                    │
                                                                    ▼
                                                    Comparação → Sugestões → Decisão
```

**V1:** "Nosso Preço" no Shopping vem de dados próprios do JapMarket (upload). Integração Formação → Shopping em evolução.

---

## Arquitetura de Dados (Planejada)

### Tabelas Supabase/Postgres

| Tabela | Descrição |
|--------|-----------|
| `products` | Catálogo de produtos (medida, marca, NCM, categoria) |
| `pricing_records` | Registros de formação (custo, preço sugerido, aprovado, estado, canal) |
| `pricing_parameters` | Fatores regionais, margens por categoria |
| `tax_rules` | Impostos por NCM |
| `pricing_versions` | Histórico versionado de preços |
| `pricing_audits` | Divergências faturado × combinado |
| `market_comparisons` | Dados de Shopping (nosso × concorrentes) |
| `users` | Usuários e permissões |
| `logs` | Log de ações (quem, quando, o quê) |

### APIs (Planejadas)

| Rota | Método | Função |
|------|--------|--------|
| `/api/jappricing/prices` | GET/POST | CRUD de preços formados |
| `/api/jappricing/calculate` | POST | Calcular sugestão de preço |
| `/api/jappricing/market` | GET/POST | Dados de Shopping (market_comparisons) |
| `/api/jappricing/audit` | GET/POST | Divergências e aprovações |
| `/api/jappricing/parameters` | GET/PUT | Parâmetros e regras |
| `/api/jappricing/export` | GET | Exportação Excel/CSV |

**V1:** Dados em `localStorage`. APIs em desenvolvimento.

---

## Regras de Negócio

1. **Formação:** Preço sugerido = Custo médio × (1 + margem alvo). Margem considera estoque, trânsito e categoria.
2. **Shopping:** Uma cor = uma legenda. Estado é eixo principal de segmentação.
3. **Auditoria:** Divergência = Valor faturado − Valor esperado. Status: Pendente → Aprovada/Reprovada → Enviada → Resolvida.
4. **Parâmetros:** Fatores regionais multiplicam o preço base. Impostos por NCM aplicados no cálculo.

---

## Limitações do V1

- Dados em `localStorage` (não persistem entre dispositivos)
- Integração Formação → Shopping: manual (preço aprovado não flui automaticamente)
- Parâmetros: mock, sem persistência
- Upload manual (SISPRO, invoices, concorrentes)
- Sem jobs agendados
- Sem n8n

---

## Evolução Futura

- Migração para Supabase/Postgres
- Integração SISPRO real
- Jobs agendados (cálculo diário, export)
- n8n para automações
- "Nosso Preço" no Shopping vindo da Formação
- PDF/OCR no upload de concorrentes

---

## Cronograma (até Março)

| Semana | Entregáveis | Riscos |
|--------|-------------|--------|
| **1** | Integração JapMarket como aba • Parâmetros (mock) • Documentação | — |
| **2** | Schema Supabase • APIs básicas (prices, market, audit) • Persistência parcial | Dependência Supabase |
| **3** | Persistência completa • Export unificado • Testes | Integração Formação→Shopping |
| **4** | Deploy • Refinamentos • Go-live | Ajustes pós-teste |
| **5** | Testes UAT • Correções • Treinamento | Feedback usuários |

### Itens que podem ser cortados sem matar o produto

- Aba Parâmetros com persistência (manter mock)
- Integração automática Formação → Shopping
- Jobs agendados
- n8n

### Itens críticos (não cortar)

- Formação de preço funcional
- Shopping integrado
- Auditoria de divergências
- Exportação Excel
- Histórico de preços

---

## Navegação e URLs

- **Sidebar:** Apenas "JapPricing" (JapMarket removido)
- **URL direta Shopping:** `?view=pricing&tab=market` ou `?view=market` (redireciona para pricing com tab market)
- **Desacoplar:** Preserva tab ativa na URL (`?view=pricing&tab=market&detach=true`)
