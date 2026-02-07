## Plataforma JapBase – Visão Técnica e Estratégica 2025

Este documento consolida a visão técnica e estratégica do **JapBase**, o ecossistema corporativo da diretoria Japurá Pneus. Descreve os módulos já esboçados no frontend, as **ferramentas e integrações** necessárias, bem como os **princípios arquiteturais fundamentais** que guiam o desenvolvimento da plataforma.

> **📁 Estrutura Atual do Repositório**:  
> O código está organizado conforme a seção **2.5.2. Estrutura de Repositório Recomendada**.  
> Consulte o `README.md` na raiz do repositório para instruções de desenvolvimento.

---

## 1. Visão Geral do JapBase

### 1.1. Propósito Estratégico

O **JapBase** é a plataforma estratégica corporativa da Japurá Pneus, desenvolvida para centralizar **inteligência de dados, planejamento, simulações e decisões de alto impacto da diretoria**.

**Objetivo principal**: Substituir:
- Planilhas críticas em Excel
- Controles manuais
- Dependência de e-mails
- Trello e BI fragmentado

Por uma **plataforma única, integrada, rastreável e evolutiva**.

**Princípio fundamental**:  
> **O JapBase não é operacional. Ele analisa, simula, planeja e direciona.**

### 1.2. Arquitetura Técnica Atual

**Decisão Arquitetural Estratégica**: O JapBase é construído como um **ecossistema corporativo estratégico** usando **arquitetura polissistêmica em monorepo evolutivo**:

- **Monorepo Estrutural**: Todos os módulos convivem no mesmo repositório Git para eficiência de desenvolvimento e refatoração cross-sistema
- **Bounded Contexts Independentes**: Cada módulo é um **sistema lógico independente** (Bounded Context) com ownership claro de dados
- **Preparação para Polirepo**: Estrutura organizada em `apps/*` permite extração futura para repositórios independentes **sem retrabalho estrutural**
- **Alto Volume de Dados**: Arquitetura preparada para grande processamento via views materializadas, ETL, data marts e estratégias OLTP/OLAP

- **Frontend**:  
  - Next.js 16 (App Router, TypeScript)  
  - Tailwind CSS v4 (Design System Japurá 2025)  
  - Componentização com `src/components` (layout, ui, modules)  
  - React 18+ com hooks e componentes funcionais
  - Framer Motion para animações
  - Lucide React para ícones

- **Backend**:  
  - **Arquitetura Polissistêmica**:
    - Cada módulo representa um **Bounded Context** com Supabase próprio (banco PostgreSQL isolado)
    - Cada sistema possui **ownership exclusivo** de seus dados (Write Models)
    - Comunicação entre sistemas via **contratos explícitos** (APIs REST, Data Products, views de leitura)
    - **Anti-acoplamento estrutural**: nenhum módulo importa código de negócio de outro módulo diretamente
  - **Supabase** (um por sistema/módulo):
    - Banco de dados PostgreSQL (isolado por sistema)
    - Separação **OLTP (Write Models)** e **OLAP (Read Models)** via views materializadas
    - Autenticação e autorização (Row Level Security)
    - Storage para arquivos
    - Edge Functions (Deno runtime)
    - Real-time subscriptions
    - API REST automática
  - **Linguagens**:
    - **TypeScript** para Edge Functions, scripts e contratos compartilhados
    - **SQL** para schemas, views materializadas, triggers, stored procedures e data products
    - **Deno** runtime para Edge Functions do Supabase

- **Integrações e Automação**:  
  - **n8n** para orquestração de workflows, ETLs e replicação de dados entre sistemas
  - APIs REST para comunicação com sistemas externos (JapHub, Sispro)
  - Webhooks para eventos em tempo real
  - Processos de ETL para construção de data marts e views consolidadas

- **Plataforma principal**: **JapBase** (painéis estratégicos da diretoria)  
- **Módulos internos da JapBase** (já esboçados no código):  
  - `JapImport` – Importações / PIMPs  
  - `JapView` – BI Comercial / Estratégico  
  - `JapCatalog` – Catálogo e Fichas Técnicas  
  - `JapMarket` – Shopping de Preços e Precificação  
  - `JapDistribution` – Distribuição Inteligente  
  - `JapAudit` – Auditoria de Faturamento  
  - `JapSales` – Metas, Performance e Direcionamento Comercial  
  - `DashboardHome` – Visão Geral Executiva  
- **Plataforma operacional**: **JapHub** (sistema separado – foco em execução operacional, colaboradores / vendedores).  
- **B2B Clientes**: Portal específico (fora deste repo) para clientes finais.

---

## 2. Conceito Arquitetural Fundamental

### 2.1. JapBase como HUB Estratégico Unificado

O JapBase funciona como um **Hub Estratégico Unificado**, no qual:

- Todos os módulos aparecem **integrados em uma única interface**
- A navegação é **contínua** (sem troca perceptível de sistema)
- A diretoria enxerga o JapBase como **uma única plataforma**

### 2.2. Princípio: Módulo = Bounded Context com Ownership de Dados

**Princípio arquitetural fundamental**:

> No JapBase, cada módulo visível ao usuário é um **Bounded Context** (domínio de negócio delimitado), tratado como **sistema lógico independente**, com:
> - **Frontend próprio** (isolado em `apps/{sistema}/` no monorepo atual)
> - **Backend próprio** (Supabase independente com seu próprio PostgreSQL)
> - **Banco de dados próprio** (isolado, sem compartilhamento físico de tabelas)
> - **Ownership exclusivo de dados**: apenas o sistema dono escreve em suas tabelas (Write Models)
> - **Automações e serviços próprios** (Edge Functions, n8n workflows específicos)
>
> O JapBase funciona como **HUB/Shell/Orquestrador**, apresentando esses sistemas como uma única plataforma, mas mantendo isolamento arquitetural completo.

**Arquitetura Polissistêmica**:

- **JapBase Hub** (Shell/Orquestrador):
  - Frontend shell/orquestrador (Next.js) em `apps/japbase-hub/`
  - Autenticação centralizada (Supabase Auth compartilhado ou SSO)
  - Navegação e layout unificado
  - Consome sistemas via **contratos explícitos** (APIs REST, Data Products)
  - **NÃO possui banco de dados próprio** (ou apenas banco mínimo para configuração/autenticação)

- **Cada Módulo = Bounded Context Independente**:
  - `JapImport` → Bounded Context de Importações (Supabase próprio, schema `japbase`)
  - `JapView` → Bounded Context de BI/Vendas (Supabase próprio, schemas `view.*`)
  - `JapCatalog` → Bounded Context de Catálogo (Supabase próprio, schemas `catalog.*`)
  - `JapMarket` → Bounded Context de Precificação (Supabase próprio, schemas `market.*`)
  - `JapDistribution` → Bounded Context de Distribuição (Supabase próprio, schemas `distribution.*`)
  - `JapAudit` → Bounded Context de Auditoria (Supabase próprio, schemas `audit.*`)
  - `JapSales` → Bounded Context de Vendas/Metas (Supabase próprio, schemas `sales.*`)

**Comunicação entre Sistemas** (via Contratos Explícitos):

- **Por Comando**: APIs REST versionadas (`/api/v1/pimps`, `/api/v2/pimps`)
- **Por Dados**: Data Products (views SQL de leitura, materialized views)
- **Por Eventos** (futuro): Message queue para eventos assíncronos
- **Nenhum acesso direto a banco** entre sistemas (apenas leitura de views via API ou ETL)
- **Nenhum acoplamento de código**: sistemas não importam código de negócio uns dos outros

**Ownership de Dados**:

- Cada sistema é **dono exclusivo** de suas tabelas de escrita (Write Models)
- Outros sistemas **apenas leem** via:
  - **APIs REST** (queries e comandos)
  - **Data Products** (views de leitura otimizadas para OLAP)
  - **ETL/Replicação** (processos assíncronos para data marts)

**Benefícios da Arquitetura Polissistêmica**:

- **Isolamento total** (um sistema não afeta os outros)
- **Escalabilidade independente** (cada sistema escala conforme necessidade)
- **Deploy independente** (atualizar um módulo não derruba o resto)
- **Evolução independente** (tecnologias podem divergir por sistema)
- **Manutenção isolada** (equipes podem trabalhar independentemente)
- **Segurança** (brecha em um sistema não compromete os outros)
- **Performance** (cada banco otimizado para seu domínio específico - OLTP vs OLAP)
- **Preparação para Polirepo**: estrutura em `apps/*` permite extração sem retrabalho estrutural

### 2.3. JapHub como HUB Operacional

O **JapHub** é a plataforma operacional da empresa, voltada à **execução diária**.

**Funções do JapHub**:
- Execução logística
- Operação comercial
- Acompanhamento físico
- Atendimento e supervisão

**Módulos do JapHub** (fora do escopo deste repositório):
- `JapDock` – carregamento, descarregamento e trânsito
- `JapLoad` – formação operacional de cargas e cubagem
- `japPay` – gestão operacional de contas a receber
- `JapReceive` – gestão operacional de contas a pagar
- Módulo de Análise de Crédito – análise e aprovação de crédito para clientes
- Outros módulos operacionais futuros

**Fluxo de decisão**:
> **JapBase decide → JapHub executa → JapHub retorna status**

### 2.4. Comunicação JapBase ↔ JapHub

**Princípios de integração**:
- Comunicação **exclusivamente via APIs**
- Contratos **versionados**
- **Logs e rastreabilidade** completos
- **Nenhum acesso direto a banco** entre plataformas

**Fluxo padrão**:
1. JapBase decide (ex.: aprova distribuição, define meta, autoriza importação)
2. JapHub executa (ex.: forma carga, acompanha vendedor, recebe container, gerencia contas a receber/pagar, analisa crédito)
3. JapHub retorna status (ex.: carga despachada, meta atingida, container recebido, status financeiro, resultado de análise de crédito)

### 2.5. Arquitetura Polissistêmica: Monorepo Evolutivo

#### 2.5.1. Decisão Arquitetural Estratégica

O JapBase adota uma **arquitetura polissistêmica em monorepo evolutivo**, onde:

- **Hoje (Monorepo Estrutural)**:
  - Todos os módulos convivem no mesmo repositório Git (`japbase/`)
  - Estrutura organizada em `apps/*` (um app = um sistema/Bounded Context)
  - Cada sistema possui Supabase próprio (banco PostgreSQL isolado)
  - Comunicação via contratos explícitos (APIs, views, data products)
  - Compartilhamento apenas de infraestrutura comum (`packages/ui`, `packages/contracts`)

- **Amanhã (Polirepo por Sistema)**:
  - Sistemas maduros podem ser extraídos para repositórios independentes
  - Extração **sem retrabalho estrutural** (código já isolado em `apps/{sistema}/`)
  - Contratos mantidos via pacote npm `@japbase/contracts`
  - Deploy e CI/CD independentes por sistema

**Princípios Fundamentais**:

1. **Bounded Contexts Independentes**:
   - Cada módulo representa um domínio de negócio delimitado (DDD - Domain-Driven Design)
   - Ownership exclusivo de dados: apenas o sistema dono escreve em suas tabelas
   - Outros sistemas apenas leem via contratos explícitos

2. **Anti-Acoplamento Estrutural**:
   - Nenhum módulo importa código de negócio de outro módulo diretamente
   - Comunicação exclusiva via contratos (TypeScript interfaces, schemas de API, DTOs)
   - Compartilhamento apenas de infraestrutura comum (UI components, configs, tipos de contrato)

3. **Arquitetura Evolutiva**:
   - Hoje: Monorepo para velocidade de desenvolvimento e refatoração cross-sistema
   - Amanhã: Polirepo quando sistemas atingirem maturidade e times precisarem de autonomia operacional completa

#### 2.5.2. Estrutura de Repositório Recomendada

A estrutura do monorepo reflete a arquitetura polissistêmica:

```
japbase/
├── apps/                          # Aplicações (um app = um sistema/Bounded Context)
│   ├── japbase-hub/               # Shell/Orquestrador (JapBase Hub)
│   │   ├── src/
│   │   │   ├── app/               # Next.js App Router
│   │   │   ├── components/
│   │   │   │   ├── layout/        # Layout unificado
│   │   │   │   └── modules/       # Módulos como componentes de integração
│   │   │   └── lib/
│   │   │       └── api-clients/   # Clientes de API para cada sistema
│   │   └── package.json
│   │
│   ├── japimport/                 # Sistema JapImport (Bounded Context)
│   │   ├── src/
│   │   │   ├── app/               # Frontend Next.js (se separado)
│   │   │   ├── components/        # Componentes específicos do JapImport
│   │   │   ├── services/          # pimpsService.ts, etc.
│   │   │   └── lib/
│   │   ├── supabase/              # Migrations e Edge Functions do JapImport
│   │   │   ├── migrations/
│   │   │   └── functions/
│   │   └── package.json
│   │
│   ├── japview/                   # Sistema JapView
│   ├── japmarket/                 # Sistema JapMarket
│   ├── japdistribution/           # Sistema JapDistribution
│   ├── japcatalog/                # Sistema JapCatalog
│   ├── japaudit/                  # Sistema JapAudit
│   └── japsales/                  # Sistema JapSales
│
├── packages/                      # Pacotes compartilhados (sem lógica de negócio)
│   ├── ui/                        # Design System (componentes React/Tailwind)
│   │   ├── src/
│   │   │   ├── components/        # Button, Card, Table, etc.
│   │   │   └── styles/           # Tailwind config, tokens de design
│   │   └── package.json
│   │
│   ├── contracts/                 # Contratos de Integração (TypeScript types)
│   │   ├── src/
│   │   │   ├── japimport/         # Tipos de API do JapImport
│   │   │   │   ├── api.ts         # GetPimpsResponse, CreatePimpRequest, etc.
│   │   │   │   └── data-products.ts  # Tipos de views/data products
│   │   │   ├── japview/           # Tipos de API do JapView
│   │   │   └── shared/            # Tipos compartilhados (enums, utils)
│   │   └── package.json
│   │
│   └── config/                    # Configurações compartilhadas
│       ├── eslint-config/
│       ├── tsconfig/
│       └── tailwind-config/
│
├── infra/                          # Infraestrutura e automação
│   ├── sql/                       # Scripts SQL compartilhados (se houver)
│   ├── n8n/                       # Workflows n8n (ETLs, automações)
│   ├── supabase/                  # Configs globais Supabase (se houver)
│   └── etl/                       # Scripts de ETL e data pipeline
│
├── docs/                           # Documentação
│   ├── arquitetura/               # Decisões arquiteturais (ADRs)
│   ├── contratos/                 # Documentação de APIs e contratos
│   └── guias/                     # Guias de desenvolvimento
│
├── package.json                    # Workspace root (gerenciamento de monorepo)
├── pnpm-workspace.yaml            # ou npm/yarn workspaces
└── turbo.json                      # Turborepo (opcional, para builds paralelos)
```

**Regras de Organização**:

- `apps/*`: Cada app é um sistema completo e independente. Pode ter frontend próprio ou ser apenas backend (Edge Functions + migrations).
- `packages/ui`: Design System puro, sem dependências de negócio.
- `packages/contracts`: Apenas tipos TypeScript, interfaces de API, DTOs. Zero lógica de negócio.
- `infra/*`: Scripts, workflows e configurações de infraestrutura que podem ser compartilhados ou específicos por sistema.
- `docs/*`: Documentação arquitetural, ADRs (Architecture Decision Records), contratos de API.

#### 2.5.3. Contratos de Integração Entre Sistemas

**Princípio**: Sistemas não compartilham código de negócio, apenas contratos.

**Tipos de Contratos**:

1. **Contratos de API (REST)**:
   - Definidos em `packages/contracts/src/{sistema}/api.ts`
   - Exemplo: `packages/contracts/src/japimport/api.ts` define `GetPimpsResponse`, `CreatePimpRequest`, etc.
   - Consumidores importam apenas os tipos: `import { GetPimpsResponse } from '@japbase/contracts/japimport'`

2. **Contratos de Dados (Data Products)**:
   - Views SQL documentadas como "data products" que outros sistemas podem consumir
   - Exemplo: `japbase.view.vw_pimp_historico` é um data product que JapView pode consumir via API ou ETL
   - Tipos TypeScript correspondentes em `packages/contracts/src/{sistema}/data-products.ts`
   - Documentados em `docs/contratos/data-products.md`

3. **Contratos de Eventos** (futuro):
   - Eventos assíncronos entre sistemas (ex.: "PIMP criado", "Preço atualizado")
   - Schemas de eventos em `packages/contracts/src/events/`

**Exemplo de Uso**:

```typescript
// ❌ ERRADO: Importar código de negócio de outro sistema
import { getPimps } from '../../japimport/services/pimpsService'

// ✅ CORRETO: Importar apenas tipos de contrato
import { GetPimpsResponse } from '@japbase/contracts/japimport'
import { fetchJapImportAPI } from '@japbase/hub/lib/api-clients'

async function loadPimpsForDashboard(): Promise<GetPimpsResponse> {
  return fetchJapImportAPI('/api/v1/pimps')
}
```

#### 2.5.4. Comunicação Entre Sistemas: Read Models vs Write Models

**Padrão CQRS Simplificado**:

- **Write Models** (tabelas de escrita):
  - Cada sistema possui suas próprias tabelas de escrita (ex.: `japbase.pimps`, `japbase.pimp_pedidos_gripmaster`)
  - Apenas o sistema dono pode escrever diretamente nessas tabelas
  - Otimizadas para **OLTP** (transações rápidas, normalização, integridade referencial)

- **Read Models** (views e data products):
  - Views SQL materializadas ou não materializadas para leitura eficiente
  - Exemplo: `japbase.vw_pimp_historico` consolida dados de múltiplas tabelas para leitura rápida
  - Otimizadas para **OLAP** (consultas analíticas, agregações, desnormalização estratégica)
  - Outros sistemas consomem apenas essas views (via API ou ETL), nunca as tabelas brutas

**Fluxo Típico**:

1. Sistema A escreve em suas tabelas (Write Model)
2. Trigger ou processo ETL atualiza views materializadas (Read Model)
3. Sistema B consome a view via API REST ou processo de replicação
4. Sistema B nunca escreve diretamente nas tabelas do Sistema A

#### 2.5.5. Fluxo de Dados Típico Entre Sistemas

Exemplo: **Do PIMP (JapImport) até o Dashboard de Vendas (JapView / JapSales)**:

1. **Registro de PIMP**:
   - Usuário (importação) alimenta planilha ou formulário.
   - n8n + Supabase inserem/atualizam dados nas tabelas de PIMPs do Supabase do **JapImport** (Write Model).

2. **Consolidação na view**:
   - Uma view `vw_pimp_historico` consolida todos os PIMPs com status, datas, fornecedor, valores, etc. (Read Model).

3. **Exposição para outros sistemas**:
   - Edge Function ou API REST expõe dados dessa view para consumo externo (JapView, JapSales, Hub).

4. **Replicação ou Consumo Direto**:
   - ETL (n8n) lê da view do JapImport e grava em:
     - Tabelas de fatos (`view.fato_importacoes`) no Supabase do **JapView**, ou
     - Um data mart central (ex.: `analytics.fato_importacoes`).

5. **Consumo no Dashboard**:
   - JapView/JapSales leem das suas próprias tabelas/views (já consolidadas) para montar gráficos e KPIs.

**Importante**:

- Nenhum sistema faz `INSERT/UPDATE/DELETE` diretamente nas tabelas de outro sistema.
- A **integração sempre acontece**:
  - via **APIs REST** (comandos),
  - e/ou via **processos de leitura/replicação** (dados derivados).

#### 2.5.6. Critérios para Extração para Polirepo

Um módulo deve ser extraído para polirepo quando **pelo menos 3 dos seguintes critérios** forem atendidos:

1. **Maturidade de Domínio**:
   - O sistema possui schema estável e bem definido
   - Contratos de API versionados e documentados
   - Lógica de negócio consolidada

2. **Escala Operacional**:
   - Alto volume de transações/dados específico desse sistema
   - Necessidade de escalar infraestrutura independentemente
   - Performance degradando outros sistemas no monorepo

3. **Autonomia de Time**:
   - Time dedicado ao sistema com ciclo de desenvolvimento próprio
   - Necessidade de deploy independente sem coordenação com outros sistemas
   - Requisitos de segurança/compliance específicos

4. **Complexidade Técnica**:
   - Migrações de banco frequentes que impactam builds do monorepo
   - Edge Functions complexas que requerem CI/CD próprio
   - Dependências específicas que conflitam com outros sistemas

5. **Isolamento de Dados**:
   - Dados sensíveis que requerem isolamento físico de banco
   - Requisitos de backup/DR específicos
   - Necessidade de replicação geográfica independente

**Processo de Extração**:

1. **Fase de Preparação** (no monorepo):
   - Mover código do sistema para `apps/{sistema}/` (se ainda não estiver)
   - Garantir que contratos estejam em `packages/contracts`
   - Documentar dependências e integrações

2. **Fase de Extração**:
   - Criar novo repositório Git
   - Copiar `apps/{sistema}/` para raiz do novo repo
   - Configurar CI/CD independente
   - Publicar `packages/contracts` como pacote npm `@japbase/contracts`

3. **Fase de Migração**:
   - Atualizar imports no JapBase Hub para consumir APIs do sistema extraído
   - Manter compatibilidade durante período de transição
   - Desativar código antigo após validação

**Zero Retrabalho Estrutural**:

Se a estrutura do monorepo seguir o padrão `apps/*`, a extração será:
- Copiar `apps/{sistema}/` para novo repo
- Publicar `packages/contracts` como pacote npm
- Atualizar referências de import no Hub

Sem necessidade de refatoração estrutural do código do sistema.

#### 2.5.7. Garantias de Independência e Evolução

Para garantir que essa arquitetura continue saudável ao longo do tempo:

- **Contratos de Dados Versionados**:
  - Quando uma view/tabela "de integração" muda (ex.: `vw_pimp_historico`), a versão antiga é mantida por um tempo (`vw_pimp_historico_v1`, `_v2`, etc.).
  - Consumidores (JapView, JapMarket, Hub) migram gradualmente para a versão nova.

- **Migrações de Banco Isoladas por Sistema**:
  - Cada sistema mantém seu próprio diretório de migrações (ex.: `apps/japimport/supabase/migrations/*`).
  - Não há migração compartilhada que afete múltiplos sistemas ao mesmo tempo.

- **Monitoramento de Latência e Frescor de Dados**:
  - Para integrações por banco (ETL/replicação), são definidos SLAs de frescor (ex.: dados atualizados a cada 15 minutos).
  - Para integrações por API (comandos), a latência é tratada como síncrona (resposta imediata).

- **Fallbacks Controlados**:
  - Se o sistema A estiver fora do ar, o sistema B continua operando com dados já replicados/históricos.
  - Quando a conexão é restabelecida, processos de sincronização reconstroem o estado.

Essa visão garante que:

- Cada módulo do JapBase é **fortemente independente** (frontend + backend + banco próprios).
- Ao mesmo tempo, é possível construir **uma visão unificada de negócio** através de:
  - APIs REST bem definidas (comandos),
  - e camadas de dados (views, data marts, replicação) desenhadas para **leitura e análise**, nunca para escrita cruzada entre sistemas.

### 2.6. Comunicação entre Sistemas do JapBase

**Princípios de Integração entre Módulos**:

Como cada módulo é um Bounded Context com banco próprio, a comunicação segue os mesmos princípios da integração JapBase ↔ JapHub:

- **Comunicação exclusivamente via contratos explícitos** (APIs REST, Data Products, eventos)
- **Contratos versionados** entre sistemas
- **Nenhum acesso direto a banco** entre sistemas (apenas leitura de views via API ou ETL)
- **Logs e rastreabilidade** completos
- **Webhooks** para eventos assíncronos

**Exemplos de Comunicação entre Sistemas**:

- **JapView → JapImport**: Buscar dados de importações para análises de BI (via API ou data product `vw_pimp_historico`)
- **JapDistribution → JapView**: Consumir histórico de vendas para simulações (via API ou data product `view.vw_vendas_resumo`)
- **JapMarket → JapCatalog**: Validar produtos ao comparar preços (via API REST)
- **JapAudit → JapView**: Buscar dados de vendas para auditoria (via API ou ETL)
- **JapSales → JapView**: Consumir performance histórica para definir metas (via API ou data product)

**Padrão de API entre Sistemas**:

```typescript
// Exemplo: JapView consumindo dados do JapImport
GET https://api.japimport.japbase.com/v1/pimps?status=em_transito
Authorization: Bearer [token_japbase_hub]

// Resposta padronizada
{
  "data": [...],
  "meta": {
    "total": 10,
    "page": 1,
    "per_page": 20
  }
}
```

**Autenticação entre Sistemas**:

- **Service-to-Service**: Tokens de serviço específicos
- **Via JapBase Hub**: Hub autentica usuário e repassa token aos sistemas
- **OAuth 2.0**: Para integrações mais complexas (futuro)

---

## 3. Estrutura de Pastas Frontend

- **`src/app`**  
  - `layout.tsx` – Layout raiz, fonte Inter e import do CSS global  
  - `page.tsx` – Orquestração de views (useState + Sidebar + módulos)  
  - `globals.css` – Tailwind v4 + ajustes de base (cores Japurá, fonte, fundo)  

- **`src/components/layout`**  
  - `Sidebar.tsx` – Navegação lateral fixa (JapBase v2)

- **`src/components/ui`**  
  - `KpiCard.tsx` – Card genérico de KPI com animação (usando Framer Motion)

- **`src/components/modules`**  
  - `DashboardHome.tsx` – Visão Geral (KPIs, gráfico placeholder, cotações dólar/euro, notícias, alterações)  
  - `JapImport.tsx` – Esboço PIMPs com abas, tabela estilo Excel, dólar do dia, painel de notícias  
  - `JapView.tsx` – Esboço BI Comercial (filtros, funil, KPIs, tabelas)  
  - `JapCatalog.tsx` – Esboço Fichas Técnicas (workflow e estatísticas)  
  - `JapMarket.tsx` – Esboço Shopping de Preços (comparação concorrentes, sugestões)  
  - `JapDistribution.tsx` – Esboço Distribuição Inteligente (sugestões preditivas)  
  - `JapAudit.tsx` – Esboço Auditoria de Faturamento (NF vs condição comercial)  
  - `JapSales.tsx` – Esboço Metas e Performance Comercial (ainda não criado)  

---

## 4. Design System Japurá 2025

- **Cores principais** (configuradas em `tailwind.config.ts` e `globals.css`):
  - `japura-bg` – `#f0efee` (background cinza suave)  
  - `japura-black` – `#000000` (sidebar, títulos)  
  - `japura-dark` – `#3E3F40` (texto principal)  
  - `japura-grey` – `#827f7f` (texto de apoio)  
  - `japura-white` – `#ffffff` (cards)  
- **Fonte**: `Inter` (via `next/font/google`, aplicada no `layout.tsx`)  
- **Radius padrão**: `rounded-japura` = 12px  
- **Layout base**:  
  - `flex h-screen`  
  - Sidebar fixa (`w-[280px]`, `bg-japura-black`)  
  - Conteúdo principal scrollável (`flex-1 overflow-y-auto bg-japura-bg`)  

---

## 5. Módulos do JapBase – Detalhamento Funcional

Esta seção detalha cada módulo do JapBase, suas responsabilidades, funcionalidades e **limites funcionais** claros.

### 5.1. JapImport – Gestão de PIMPs (Processos de Importação)

**Papel**:  
O JapImport é o módulo do JapBase responsável **exclusivamente** pelo acompanhamento dos Processos de Importação (PIMPs).

**Objetivo**: Substituir integralmente a planilha Excel de importação, mantendo a mesma lógica visual, porém com automação, histórico e inteligência.

**Status da Integração com Backend**:
- ✅ **Integração com Supabase implementada** (janeiro 2025)
- ✅ Cliente Supabase configurado (`src/lib/supabaseClient.ts`)
- ✅ Serviço de dados criado (`src/services/pimpsService.ts`)
- ✅ Componente `JapImport.tsx` atualizado para consumir dados reais do Supabase
- ✅ Funcionalidades implementadas:
  - Busca de PIMPs (ativos, finalizados, histórico)
  - Busca de produtos detalhados por PIMP
  - Edição inline de campos (quantidade, valores, datas, fornecedor, produto)
  - Atualização de cores de linha (row_color)
  - Filtros por status e fornecedor
  - Busca textual
  - Contagem dinâmica de PIMPs por status
- ⚠️ **Requer configuração**: Variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Opcional: `NEXT_PUBLIC_SUPABASE_SCHEMA` (default `import`), `NEXT_PUBLIC_SUPABASE_TABLE_FLAVOR` (`japimport` ou `doc`). Rota de diagnóstico: **GET /api/supabase-check** (retorna colunas e amostra de cada tabela). SQL de referência: `docs/supabase_schema_japimport.sql`.

**Estrutura de Dados no Supabase**:

**Tabela `pimps`**:
- `id` (uuid, PK)
- `numero` (text) - Ex: "PIMP-2025-001"
- `fornecedor` (text)
- `produto` (text, nullable)
- `quantidade` (integer)
- `valor_usd` (numeric)
- `valor_brl` (numeric)
- `status` (text) - Ex: "Em Trânsito", "Aguardando Embarque", "Concluído", etc.
- `data_inicio` (date)
- `data_prevista` (date, nullable)
- `data_finalizacao` (date, nullable)
- `row_color` (text, nullable) - Cor hexadecimal para destacar a linha
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Tabela `pimps_produtos`**:
- `id` (uuid, PK)
- `pimp_id` (uuid, FK → pimps.id)
- `descricao` (text)
- `medida` (text, nullable)
- `modelo` (text, nullable)
- `marca` (text, nullable)
- `quantidade` (integer)
- `valor_unitario_usd` (numeric)
- `valor_total_usd` (numeric)
- `valor_total_brl` (numeric)
- `transportadora` (text, nullable)
- `eta` (date, nullable) - Estimated Time of Arrival
- `container` (text, nullable)
- `lote` (text, nullable)
- `created_at` (timestamp)

**Fluxo de Trabalho**:

1. **Início do PIMP via Email**:
   - O diretor **Marcus** envia email com documentos de importação (pedidos, cotações, documentos de fornecedores)
   - Sistema monitora a caixa de email do Marcus (via n8n)
   - Detecta automaticamente novos PIMPs através de padrões no assunto/corpo do email

2. **Extração Automática de Dados**:
   - **OCR + IA** extrai informações dos documentos anexados:
     - Produtos (descrição, medidas, quantidades)
     - Valores em dólar (unitário e total)
     - Fornecedor
     - Datas (pedido, embarque previsto)
     - Números de container/rastreamento
   - Dados extraídos são validados e inseridos automaticamente no sistema
   - Usuário pode revisar e corrigir dados extraídos antes de confirmar

3. **Acompanhamento Automático de Status**:
   - **Automação via n8n** consulta periodicamente:
     - Sites de transportadoras (Maersk, MSC, CMA CGM, etc.)
     - Portais de rastreamento de containers
     - Status de embarque, trânsito, chegada ao porto
   - Atualização automática de ETAs (Estimated Time of Arrival)
   - Notificações quando status muda ou há atrasos

4. **Interface e Visualização**:
   - Interface **Excel-like** (grid com linhas de grade visíveis)
   - **Abas**:
     - PIMPs Ativos (em andamento)
     - PIMPs Recebidos (finalizados)
     - Histórico Geral (todas as importações desde o primeiro processo)
   - Cores por status (configuráveis)
   - Edição inline de campos
   - Expansão de linhas para ver produtos detalhados

**Funcionalidades Principais**:
- **Registro de logs** (manual x automático) - rastreabilidade completa
- **Controle de**:
  - Fornecedor
  - Datas (abertura, embarque, ETA, recebimento)
  - Quantidades
  - Valor em dólar (com histórico de câmbio do dia)
  - Produtos detalhados (marca, modelo, medida, quantidade, valor)
- **Identificação automática de**:
  - Produtos sem cadastro no Sispro
  - Produtos sem ficha técnica no JapCatalog
- **Exportação** para Excel com filtros customizáveis

**Limite funcional**:
> **JapImport NÃO faz precificação.** Custos e contexto são fornecidos ao JapMarket.

**Integrações**:
- ✅ **Supabase** (Backend principal - IMPLEMENTADO):
  - Schema: `import` (configurável via `NEXT_PUBLIC_SUPABASE_SCHEMA`). Tabelas: `pimps`, `pimps_produtos`, `pimps_transito`. Config centralizada em `src/lib/supabaseConfig.ts`.
  - Serviço: `src/services/pimpsService.ts` (aceita formato “japimport” ou “doc” via `NEXT_PUBLIC_SUPABASE_TABLE_FLAVOR`).
  - Cliente: `src/lib/supabaseClient.ts`
  - Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; opcional: `NEXT_PUBLIC_SUPABASE_SCHEMA`, `NEXT_PUBLIC_SUPABASE_TABLE_FLAVOR`.
  - Diagnóstico: GET `/api/supabase-check` retorna as colunas retornadas por cada tabela.
  - Funcionalidades: Busca, edição inline, filtros, contagem dinâmica
- 🔄 **Email do Marcus** (monitoramento via n8n) - Planejado
- 🔄 **OCR/IA** para extração de dados dos documentos - Planejado
- 🔄 **API de cotação do dólar** (para histórico e cálculo de valores) - Planejado
- 🔄 **n8n** para automação de status de cargas e containers - Planejado
- 🔄 **Sites de transportadoras** (web scraping ou APIs quando disponíveis) - Planejado
- 🔄 **Comunicação com outros sistemas** (quando separados):
  - JapView pode consumir dados de importações via API
  - JapDistribution consome dados de importações futuras via API

---

### 5.2. JapMarket – Precificação e Shopping de Preços

**Papel**:  
O JapMarket é o **único módulo responsável por precificação** no JapBase.

**Funcionalidades**:
- **Shopping de preços automatizado por estado**
- **Scraping via n8n** de concorrentes
- **Upload manual** de preços obtidos pela equipe comercial
- **OCR + IA** para padronização de descrições
- **Comparação**:
  - Japurá × Concorrentes
  - Histórico e volatilidade de preços
- **Sugestões estratégicas de reajuste**

**Integrações**:
- n8n para scraping e OCR
- APIs de IA para normalização
- Supabase: schemas `market.shopping_precos`, `market.historico_precos`

**Fluxo de Upload de Orçamentos (manual)**:
Quando o usuário sobe uma planilha de preços de concorrente (obtida por busca manual), o fluxo segue:
1. **Upload** do arquivo (Excel, PDF)
2. **Conversão para texto/estrutura** (Excel: parse direto; PDF: OCR ou IA – em desenvolvimento)
3. **Mapeamento para o modelo padrão** da planilha de comparação
4. **Inserção no grid** com fonte explícita (ex.: "Upload manual por Fulano")

> 📄 Detalhes em `docs/japmarket-upload-flow.md`

---

### 5.3. JapDistribution – Planejamento Estratégico de Distribuição

**Papel**:  
O JapDistribution é o módulo **estratégico de logística** do JapBase. Ele **não executa logística**, apenas **planeja e simula**.

**Funcionalidades**:
- **Consolidação de**:
  - Estoque físico
  - Estoque em trânsito
  - Importações futuras (dados do JapImport)
  - Histórico de vendas (2013+)
- **Simulações de distribuição por**:
  - Estado
  - Loja
  - Canal
- **Sugestões baseadas em**:
  - Consumo histórico
  - Estoque atual
  - Mercadoria em trânsito
  - Novas chegadas
  - Eventos externos (mineração, ciclo agrícola)
- **Planejamento de cargas** (nível estratégico)

**Governança**:
- Sugestões precisam de **aprovação humana**
- Após aprovação, planos são enviados via **API ao JapHub** (JapLoad / JapDock)

**Integrações**:
- Consome dados do JapImport (importações futuras)
- Consome dados do JapView (histórico de vendas)
- API para envio de planos ao JapHub
- Supabase: schemas `distribution.simulacoes`, `distribution.planos_aprovados`

---

### 5.4. JapSales – Metas, Performance e Direcionamento Comercial

**Papel**:  
O JapSales é o módulo **estratégico de gestão comercial** da diretoria.

**Funcionalidades**:
- **Visualização por**:
  - Diretor
  - Equipe
  - Loja
  - Vendedor
  - Canal (atacado, varejo)
- **Indicadores**:
  - Faturamento
  - Metas
  - Atingimento
  - Histórico comparativo
- **Edição de metas**:
  - Mensal, semanal
  - Por loja ou vendedor
  - Com histórico e justificativa
- **Disparo de metas**:
  - Botão "Enviar Metas" no JapBase
  - Metas segmentadas por loja
  - Envio via **API ao JapHub**
  - Supervisores acompanham execução no JapHub

**Integrações**:
- Consome dados do JapView (performance histórica)
- API para envio de metas ao JapHub
- Supabase: schemas `sales.metas`, `sales.performance`, `sales.historico_metas`

---

### 5.5. JapAudit – Auditoria de Faturamento

**Papel**:  
Auditar se o faturamento respeita as **condições comerciais negociadas**.

**Funcionalidades**:
- **Comparação**:
  - Preço esperado × Preço faturado
- **Registro de**:
  - Descontos diretos
  - Campanhas
  - Aceleradores
  - Notas de crédito
- **Fluxo de aprovação**:
  - Divergência → Análise comercial → Envio ao financeiro
- **Governança**:
  - Nenhum envio automático sem aprovação humana

**Integrações**:
- Consome dados do Sispro (notas fiscais)
- Consome dados do JapMarket (preços esperados)
- Supabase: schemas `audit.notas`, `audit.divergencias`, `audit.aprovacoes`

---

### 5.6. JapView – Business Intelligence Estratégico

**Papel**:  
Substituição e evolução do QlikView. Hub centralizado de visualizações estratégicas e análises comerciais.

**Fontes de Dados**:

1. **Sispro ERP** (Principal):
   - **Sincronização automática** de dados operacionais:
     - Notas fiscais emitidas
     - Vendas detalhadas (produto, cliente, vendedor, unidade, data, valor)
     - Clientes e cadastros
     - Produtos e SKUs
     - Estoque atual
     - Preços praticados
   - **ETL via n8n**: Extração periódica do Sispro → Transformação → Carga no Supabase do JapView
   - **Histórico completo desde 2013** (migração do QlikView legado)

2. **Parâmetros Definidos pelos Diretores**:
   - Filtros e segmentações customizadas
   - Metas e benchmarks definidos pela diretoria
   - Regras de negócio específicas
   - Agrupamentos e classificações estratégicas
   - Períodos de análise preferidos
   - KPIs prioritários por diretor

**Funcionalidades Principais**:

#### 5.6.1. Visões de Vendas (Core)
- **BI histórico desde 2013** (dados do Sispro + QlikView migrado)
- **Funil de vendas**
- **Potencial de compra B2B**
- **Performance por**:
  - Cliente
  - Região
  - Vendedor
  - Canal
  - Produto
  - Unidade/Filial
  - Cidade
  - Estado
- **Dashboards dinâmicos** com filtros avançados
- **Visões de Grids**: Tabelas dinâmicas e interativas
- **Visões de Dashboards**: Painéis executivos personalizáveis
- **Faturamento por múltiplas dimensões**:
  - Por unidade/filial
  - Por vendedor
  - Por produto
  - Por mês/período
  - Por cidade
  - Por estado
  - Faturamentos gerais consolidados
- **Visualizações geográficas**:
  - Mapas interativos mostrando faturamento por estado
  - Tabelas dinâmicas com dados geográficos
  - Análises regionais comparativas
- **Notas Fiscais emitidas**:
  - Por unidade
  - Por cidade
  - Por estado
  - Com filtros avançados e exportação

#### 5.6.2. Visões Financeiras (Integração Futura com JapHub)
- **Contas a Receber** (via `japPay` – módulo do JapHub):
  - Dashboard de contas a receber
  - Análise de inadimplência
  - Projeções de recebimento
  - Envelhecimento de contas
  - Filtros por cliente, período, status
- **Contas a Pagar** (via `JapReceive` – módulo do JapHub):
  - Dashboard de contas a pagar
  - Análise de fluxo de caixa
  - Projeções de pagamento
  - Controle de fornecedores
  - Filtros por fornecedor, período, status

**Integração**:  
Dados financeiros serão consumidos via **APIs do JapHub** (`japPay` e `JapReceive`), mantendo o JapBase como visualizador estratégico e o JapHub como executor operacional.

#### 5.6.3. Análises de Crédito (Integração Futura com JapHub)
- **Aba dedicada** para análises de crédito realizadas no JapHub
- **Visualizações por status**:
  - **Aprovadas**: Análises de crédito aprovadas com detalhes e limites
  - **Negadas**: Análises negadas com justificativas e histórico
  - **Em Andamento**: Análises pendentes de aprovação/revisão
- **Filtros avançados**:
  - Por cliente
  - Por período
  - Por analista
  - Por valor solicitado
  - Por score de crédito
- **Dashboards e métricas**:
  - Taxa de aprovação/negação
  - Tempo médio de análise
  - Volume de crédito aprovado/negado
  - Tendências e histórico

**Integração**:  
Dados de análises de crédito serão consumidos via **API do JapHub** (módulo específico de análise de crédito), permitindo que a diretoria acompanhe decisões estratégicas de crédito diretamente no JapView.

**Integrações Técnicas**:
- **Sispro ERP** (fonte principal):
  - Sincronização automática via n8n (ETL periódico)
  - Dados de vendas, notas fiscais, clientes, produtos, estoque
  - Histórico completo desde 2013
- **QlikView Legado** (migração):
  - Dados históricos migrados para validação e referência
- **Parâmetros dos Diretores**:
  - Armazenados no Supabase do JapView
  - Configurações de filtros, metas, KPIs, regras de negócio
- **APIs do JapHub** (futuro):
  - `japPay` → Contas a receber
  - `JapReceive` → Contas a pagar
  - Módulo de Análise de Crédito → Status de análises
- **Comunicação com outros sistemas JapBase**:
  - JapImport → Dados de importações futuras (via API)
  - JapDistribution → Consome histórico de vendas (via API)
- **Supabase próprio**: schemas `view.fato_vendas`, `view.dim_cliente`, `view.dim_produto`, `view.dim_canal`, `view.fato_financeiro`, `view.fato_credito`, `view.parametros_diretores`

---

### 5.7. JapCatalog – Fichas Técnicas e Produtos

**Papel**:  
Ser a **fonte oficial de produto** da empresa.

**Funcionalidades**:
- **Repositório único de fichas técnicas**
- **Padronização obrigatória** (passeio, agro, mineração)
- **Versionamento**
- **Status** (pendente, aprovado, publicado)
- **Detecção automática de produtos sem ficha**
- **Workflow de solicitação**

**Integrações**:
- Consome dados do Sispro (produtos, SKUs)
- OCR para processar PDFs de fabricantes
- Supabase: schemas `catalog.fichas_tecnicas`, `catalog.produtos`, `catalog.solicitacoes`

---

### 5.8. DashboardHome – Visão Geral Executiva

**Papel**:  
Painel consolidado da diretoria com informações críticas em tempo real. **Hub central** que agrega informações de todos os módulos/sistemas.

**Funcionalidades Principais**:

- **Widget de Cotações**:
  - **Dólar** (cotação do dia, histórico)
  - **Euro** (cotação do dia, histórico)
  - Atualização automática via API de câmbio
  - Exibição destacada no topo do dashboard

- **Atualizações Consolidadas dos Módulos/Sistemas**:
  - **PIMPs mais próximos de chegada** (dados do JapImport)
  - **Últimas alterações** (log consolidado de todos os sistemas):
    - Alterações no JapImport (PIMPs criados/atualizados)
    - Alterações no JapAudit (glosas identificadas)
    - Alterações no JapCatalog (fichas técnicas criadas)
    - Alterações no JapMarket (preços atualizados)
    - Alterações no JapSales (metas definidas)
    - Alterações no JapDistribution (distribuições aprovadas)
  - **KPIs consolidados** por área (Executivo, Logística, Comercial, Financeiro)
  - **Compromissos** (integração futura com Google Calendar)

- **Dashboards Dinâmicos por Área**:
  - **Executivo**: Faturamento total, meta atingida, PIMPs ativos, clientes ativos
  - **Logística**: Estoque total, PIMPs em trânsito, sugestões de distribuição, economia estimada
  - **Comercial**: Faturamento mensal, ticket médio, vendedores ativos, novos clientes
  - **Financeiro**: Receita bruta, glosas pendentes, savings identificados, taxa de conformidade

- **Gráficos de evolução** (Savings, performance) - a implementar

**Fontes de Dados**:
- **JapImport**: PIMPs ativos, próximos de chegada, status de importações
- **JapView**: Faturamento mensal, metas, performance
- **JapAudit**: Glosas pendentes, savings identificados
- **JapDistribution**: Sugestões de distribuição, economia estimada
- **JapSales**: Metas e atingimento
- **APIs externas**: Cotação de dólar e euro
- **Logs do sistema**: Últimas alterações consolidadas de todos os módulos

**Integrações**:
- Consome dados via **APIs REST** de cada sistema (JapImport, JapView, JapAudit, etc.)
- API de cotação de câmbio (dólar/euro)
- Supabase (se usar banco único para prototipagem): tabela `public.ultimas_alteracoes` consolidada
- Google Calendar API (futuro) para compromissos

---

### 5.9. Assistente de IA do JapBase

**Papel**:  
Assistente conversacional estratégico, **exclusivo da diretoria**.

**Capacidades**:
- **Perguntas em linguagem natural**:
  - "Quais PIMPs estão em trânsito?"
  - "Onde temos risco de ruptura?"
  - "Qual impacto no mix para 2027?"
- **Cruza dados de todos os módulos** do JapBase
- **Gera resumos, alertas e insights**

**Governança**:
- **Não executa ações**
- Apenas **sugere, resume e contextualiza**

**Integrações**:
- APIs de IA (OpenAI, Anthropic, etc.)
- Acesso read-only aos dados do Supabase (todos os schemas)
- Armazenamento de conversas e insights em Supabase

---

### 5.10. Painéis Executivos da Diretoria

**Painel do Diretor de Logística**:
- Estoques
- Trânsito
- Gargalos
- Simulações do JapDistribution

**Painel do Diretor de Atacado / Comercial**:
- Equipes
- Faturamento
- Metas
- Performance
- Disparo de diretrizes comerciais

---

## 6. Integrações Necessárias

Esta seção lista **as ferramentas externas que o projeto precisará integrar** para materializar todas as funcionalidades descritas na especificação.

### 6.1. Backend e Banco de Dados – Supabase

#### 6.1.1. Visão Geral da Arquitetura de Backend

**Arquitetura Polissistêmica com Supabase**:

O JapBase adota uma **arquitetura polissistêmica** onde cada módulo é um **Bounded Context** independente:

- **Hoje (Monorepo Evolutivo)**:
  - Todos os módulos convivem no mesmo repositório Git (`japbase/`)
  - Estrutura organizada em `apps/*` (um app = um sistema/Bounded Context)
  - Cada módulo possui seu próprio Supabase (banco PostgreSQL isolado)
  - Comunicação entre módulos via contratos explícitos (APIs, views, data products)
  - Compartilhamento apenas de infraestrutura comum (`packages/ui`, `packages/contracts`)

- **Amanhã (Polirepo por Sistema)**:
  - Sistemas maduros podem ser extraídos para repositórios independentes
  - Extração **sem retrabalho estrutural** (código já isolado em `apps/{sistema}/`)
  - Contratos mantidos via pacote npm `@japbase/contracts`
  - Deploy e CI/CD independentes por sistema

**Cada módulo = Sistema Independente com Supabase Próprio**:

- **JapImport** → Supabase próprio (schema `japbase`, tabelas `pimps`, `pimp_pedidos_gripmaster`, `pimp_transito`, view `vw_pimp_historico`)
- **JapView** → Supabase próprio (schemas `view.*` com fato/dimensões de vendas)
- **JapMarket** → Supabase próprio (schemas `market.*` com preços e comparações)
- **JapDistribution** → Supabase próprio (schemas `distribution.*` com simulações e planos)
- **JapCatalog** → Supabase próprio (schemas `catalog.*` com fichas técnicas)
- **JapAudit** → Supabase próprio (schemas `audit.*` com notas fiscais e divergências)
- **JapSales** → Supabase próprio (schemas `sales.*` com metas e performance)

**Ownership de Dados**:

- Cada sistema é **dono exclusivo** de suas tabelas de escrita (Write Models)
- Outros sistemas **apenas leem** via:
  - **APIs REST** (comandos e queries)
  - **Data Products** (views de leitura, materialized views)
  - **ETL/Replicação** (processos assíncronos para data marts)

**Cada Supabase fornece**:

- **PostgreSQL gerenciado** (banco de dados relacional isolado)
- **Separação OLTP/OLAP**: Write Models (tabelas normalizadas) e Read Models (views materializadas)
- **Autenticação e autorização** (Row Level Security - RLS)
- **Storage** para arquivos (PDFs, planilhas, imagens)
- **Edge Functions** (serverless functions em Deno)
- **API REST automática** (gerada automaticamente a partir do schema)
- **Real-time subscriptions** (para atualizações em tempo real)
- **Webhooks** (para integrações externas)

**Comunicação entre Sistemas**:

- **Por Comando**: APIs REST versionadas (`/api/v1/pimps`, `/api/v2/pimps`)
- **Por Dados**: Views SQL e data products documentados
- **Por Eventos** (futuro): Message queue para eventos assíncronos
- **Nenhum acesso direto a banco** entre sistemas (apenas leitura de views via API ou ETL)

#### 6.1.2. Linguagens e Tecnologias do Backend

**TypeScript**:
- Linguagem principal para desenvolvimento
- Usado em Edge Functions do Supabase
- Type-safety em todo o código backend
- Compartilhamento de tipos entre frontend e backend

**SQL (PostgreSQL)**:
- Definição de schemas e tabelas
- Views materializadas para performance
- Stored procedures e functions
- Triggers para automações no banco
- Row Level Security (RLS) policies
- Índices e otimizações

**Deno Runtime**:
- Runtime para Edge Functions do Supabase
- Execução serverless de funções backend
- Suporte nativo a TypeScript
- Acesso direto ao banco via Supabase client

**JavaScript/TypeScript (n8n)**:
- Scripts de automação e ETL
- Workflows de integração
- Transformações de dados

#### 6.1.3. Estrutura de Bancos de Dados por Sistema

**IMPORTANTE**: Cada módulo possui seu **próprio Supabase** (banco de dados PostgreSQL separado). A estrutura abaixo descreve como cada banco será organizado internamente.

**Sistema JapImport** (Supabase próprio):
**Schemas dentro do banco JapImport**:
- `pimps` – Metadados dos processos de importação
- `pimps_logs` – Logs de alterações (manual / n8n)
- `pimps_produtos` – Produtos detalhados de cada PIMP
- `pimps_status` – Histórico de status

**Schema `view`** (JapView):
- `fato_vendas` – Tabela fato de vendas (desde 2013)
- `dim_cliente` – Dimensão de clientes
- `dim_produto` – Dimensão de produtos
- `dim_canal` – Dimensão de canais (atacado, varejo, etc.)
- `dim_regiao` – Dimensão de regiões/estados/cidades
- `dim_vendedor` – Dimensão de vendedores
- `dim_tempo` – Dimensão de tempo (para análises temporais)
- `fato_financeiro` – Dados financeiros (contas a receber/pagar via JapHub)
- `fato_credito` – Análises de crédito (via JapHub)

**Sistema JapMarket** (Supabase próprio):
**Schemas dentro do banco JapMarket**:
- `shopping_precos` – Comparações de preços por estado/data
- `historico_precos` – Histórico de preços e variações
- `concorrentes` – Cadastro de concorrentes monitorados
- `sugestoes_preco` – Sugestões de ajuste de preços

**Schema `distribution`** (JapDistribution):
- `simulacoes` – Simulações de distribuição
- `planos_aprovados` – Planos aprovados pela diretoria
- `estoque_filial` – Estoque atual por filial
- `historico_distribuicao` – Histórico de distribuições

**Sistema JapCatalog** (Supabase próprio):
**Schemas dentro do banco JapCatalog**:
- `fichas_tecnicas` – Fichas técnicas de produtos
- `produtos` – Produtos sincronizados do Sispro
- `solicitacoes` – Solicitações de fichas técnicas
- `versoes` – Versionamento de fichas técnicas

**Sistema JapAudit** (Supabase próprio):
**Schemas dentro do banco JapAudit**:
- `notas_fiscais` – Notas fiscais para auditoria
- `divergencias` – Divergências encontradas
- `aprovacoes` – Fluxo de aprovação de divergências
- `condicoes_comerciais` – Condições comerciais negociadas

**Sistema JapSales** (Supabase próprio):
**Schemas dentro do banco JapSales**:
- `metas` – Metas por loja/vendedor/período
- `performance` – Performance histórica
- `historico_metas` – Histórico de metas e justificativas

**JapBase Hub** (Supabase mínimo ou sem banco próprio):
- Se usar Supabase: apenas para autenticação centralizada (SSO)
- Ou usar autenticação compartilhada via um dos sistemas
- Configurações globais podem ficar em um sistema central ou em cada sistema

#### 6.1.4. Edge Functions (Supabase)

Edge Functions serão desenvolvidas em **TypeScript** para:

- **Processamento de dados** complexos
- **Integrações com APIs externas** (JapHub, Sispro)
- **Transformações de dados** antes de salvar no banco
- **Cálculos e análises** pesadas
- **Webhooks** para receber eventos externos
- **Autenticação customizada** quando necessário

**Estrutura de Edge Functions**:
```
supabase/
  functions/
    sync-sispro/
      index.ts          # Sincronização com Sispro
    process-import/
      index.ts          # Processamento de PIMPs
    calculate-distribution/
      index.ts          # Cálculos de distribuição
    webhook-japhub/
      index.ts          # Webhook para receber dados do JapHub
    export-data/
      index.ts          # Exportação de dados para Excel
```

#### 6.1.5. Autenticação e Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Políticas de acesso** por perfil de usuário:
  - Diretoria: acesso completo
  - Gestores: acesso a módulos específicos
  - Operadores: acesso read-only
- **JWT tokens** para autenticação
- **Refresh tokens** para sessões persistentes
- **Auditoria** de todas as alterações críticas

#### 6.1.6. Storage (Supabase Storage)

Buckets organizados por módulo:
- `imports/` – Planilhas e documentos de importação
- `catalog/` – PDFs de fichas técnicas
- `market/` – Planilhas de concorrentes
- `exports/` – Arquivos exportados (Excel, PDFs)
- `audit/` – Documentos de auditoria

#### 6.1.7. Integração Frontend ↔ Backend (Multi-Sistema)

**Arquitetura de Integração**:

Como cada módulo é um sistema separado, o JapBase Hub precisa se comunicar com múltiplos Supabase:

**Opção 1: Clientes Supabase por Sistema** (`src/lib/supabaseClients.ts`):
```typescript
import { createClient } from '@supabase/supabase-js'

// Cada sistema tem seu próprio Supabase
export const supabaseJapImport = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_JAPIMPORT_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_JAPIMPORT_ANON_KEY!
)

export const supabaseJapView = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_JAPVIEW_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_JAPVIEW_ANON_KEY!
)

// ... outros sistemas
```

**Opção 2: APIs REST por Sistema** (Recomendado para produção):
```typescript
// Cada sistema expõe APIs REST
const japImportAPI = process.env.NEXT_PUBLIC_JAPIMPORT_API_URL!
const japViewAPI = process.env.NEXT_PUBLIC_JAPVIEW_API_URL!

// O Hub consome essas APIs
export async function getPimps() {
  const response = await fetch(`${japImportAPI}/pimps`)
  return response.json()
}
```

**Uso no Frontend**:
- **Direto ao Supabase**: Queries via `supabaseJapImport.from('tabela').select()` (desenvolvimento)
- **Via APIs REST**: `fetch('/api/japimport/pimps')` (produção recomendado)

#### 6.1.8. Arquitetura Detalhada de Sistemas Independentes e Comunicação via Banco de Dados

Esta subseção concentra, de forma **mais técnica e profunda**, como os sistemas do JapBase serão **independentes** e, ao mesmo tempo, **conectados** via backend e banco de dados (Supabase/PostgreSQL).

##### 6.1.8.1. Independência de Sistemas

Cada módulo (JapImport, JapView, JapMarket, JapDistribution, JapCatalog, JapAudit, JapSales) é tratado como um **Sistema** completo:

- **Front-end próprio**:
  - Código Next.js/App Router separado (projeto ou app independente).
  - Deploy independente (cada um com seu pipeline de CI/CD).
  - Design System compartilhado (mesma biblioteca de componentes), mas **sem acoplamento de código de negócio**.

- **Backend próprio**:
  - Cada sistema possui **um projeto Supabase diferente**.
  - Cada Supabase tem **seu próprio banco PostgreSQL isolado**.
  - Edge Functions, Storage, RLS, policies, tudo configurado por sistema.

- **Banco de dados próprio**:
  - **Nenhuma tabela é compartilhada fisicamente** entre sistemas.
  - Cada banco define seus próprios schemas (`import`, `view`, `market`, `distribution`, `catalog`, `audit`, `sales`, etc.) conforme o domínio.
  - Restrições e índices são otimizados por caso de uso daquele sistema.

**Consequência prática**:

- Um deploy ou migração no **JapImport** **não** quebra o JapView, JapMarket, etc.
- Um problema de performance em uma query pesada do **JapMarket** não degrada o banco do **JapImport**.
- Cada time pode evoluir o schema do seu banco **no seu ritmo**, desde que mantenha os contratos de integração definidos.

##### 6.1.8.2. Princípio de Ownership de Dados

Para que a arquitetura seja saudável, cada dado tem **um único “dono” oficial**:

- **JapImport** é dono de:
  - PIMPs, produtos de PIMPs, trânsito de PIMPs, logs de importação, etc.
- **JapView** é dono de:
  - Fatos de venda consolidados, dimensões de cliente/produto/canal, etc.
- **JapMarket** é dono de:
  - Preços de mercado, históricos de preços e comparações com concorrentes.
- **JapCatalog** é dono de:
  - Fichas técnicas, cadastros ricos de produto, versões de fichas, etc.
- **JapAudit** é dono de:
  - Notas fiscais para auditoria, divergências, fluxos de aprovação.
- **JapSales** é dono de:
  - Metas, performance, histórico de metas e justificativas.

Regra de ouro:

- **Somente o sistema “dono” pode escrever nos seus dados.**
- Outros sistemas **apenas leem** (via API ou via cópias/visões de leitura), **nunca escrevem diretamente** nas tabelas de outro sistema.

##### 6.1.8.3. Modos de Comunicação Entre Sistemas

Existem dois grandes modos de comunicação:

1. **Comunicação por Comando (APIs REST / Edge Functions)** – “faça algo agora”.
2. **Comunicação por Dados (replicação/espelhamento em banco)** – “quero enxergar o estado consolidado”.

###### (1) Comunicação por Comando – APIs

- Usada para **operações ativas**:
  - Criar/atualizar PIMP a partir de outro sistema.
  - Disparar uma simulação de distribuição.
  - Aprovar uma divergência de auditoria.
- O sistema **consumidor** chama a API do sistema **dono**:
  - Ex.: JapDistribution chama `/api/japimport/pimps/:id/lock` no backend do JapImport.
  - Ex.: JapMarket chama `/api/japcatalog/produtos/:id` para validar se um produto existe e está ativo.
- Toda validação de negócio, RLS e autorização acontece **no backend do sistema dono**, nunca no cliente.

###### (2) Comunicação por Dados – via Banco (Leitura)

Aqui entra a parte de **comunicação pelo backend através do banco de dados**:

- Cada sistema publica **“data products”** (visões/tabelas de leitura) que são consumidos por outros sistemas de forma **read-only**.
- Implementação típica:
  - Views SQL específicas em cada Supabase (Ex.: `view.vw_pimp_historico` no Supabase do JapImport).
  - Materialized views para relatórios pesados.
  - Processos de replicação (via n8n, Edge Functions, ou Supabase/PG cron jobs) para copiar dados resumidos para outros bancos.

Existem dois padrões principais:

**Padrão A – Hub de Dados (Data Mart Centralizado)**:

- Um banco de dados (pode ser um Supabase ou um warehouse separado) funciona como **hub de leitura**:
  - Processos ETL (n8n, Edge Functions) leem dos bancos de cada sistema e **escrevem em um schema de leitura compartilhado** (ex.: `analytics.*` ou `hub.*`).
  - Este hub NÃO é dono dos dados originais, apenas dos **dados derivados** (agregações, somatórios, históricos).
- Sistemas podem:
  - Continuar expondo APIs REST para o Hub.
  - Ou permitir que o Hub leia diretamente via conexões de leitura (read-only) em cada banco.

**Padrão B – Data Mesh por Sistema (Data Products em Cada Banco)**:

- Cada sistema expõe **views “oficiais”** dentro do seu próprio banco:
  - Ex.: `japimport.view.vw_pimp_historico` – consolidando PIMPs com status, ETA, chegada, fornecedor, valores.
  - Ex.: `japview.view.vw_vendas_resumo` – consolidando vendas por período, produto, canal.
- Outros sistemas **NÃO** conectam diretamente ao banco do sistema; em vez disso:
  - O **JapBase Hub** consome essas views via APIs REST do próprio sistema.
  - Ou processos de ETL (n8n, Edge Functions) copiam o resultado dessas views para bancos de consumo (data marts).

Na prática, a arquitetura que está sendo seguida no **JapImport** hoje é:

- O módulo JapImport possui:
  - Schema `japbase` (ou `import`) com tabelas brutas de PIMPs e movimentos.
  - Uma view de leitura `vw_pimp_historico` que agrega o histórico de PIMPs.
- O frontend (`JapImport.tsx`) **nunca acessa tabelas brutas diretamente**:
  - Ele usa o serviço `pimpsService.ts`, que lê da view `vw_pimp_historico` e das tabelas específicas (`pimp_pedidos_gripmaster`, `pimp_transito`) via Supabase.
- Futuramente:
  - JapView, JapMarket, JapSales poderão consumir **apenas a view de leitura** (via API do JapImport ou processos ETL), sem tocar nas tabelas internas de importação.

##### 6.1.8.4. Fluxo de Dados Típico Entre Sistemas

Exemplo: **Do PIMP (JapImport) até o Dashboard de Vendas (JapView / JapSales)**:

1. **Registro de PIMP**:
   - Usuário (importação) alimenta planilha ou formulário.
   - n8n + Supabase inserem/atualizam dados nas tabelas de PIMPs do Supabase do **JapImport**.
2. **Consolidação na view**:
   - Uma view `vw_pimp_historico` consolida todos os PIMPs com status, datas, fornecedor, valores, etc.
3. **Exposição para outros sistemas**:
   - Edge Function ou API REST expõe dados dessa view para consumo externo (JapView, JapSales, Hub).
4. **Replicação ou Consumo Direto**:
   - ETL (n8n) lê da view do JapImport e grava em:
     - Tabelas de fatos (`view.fato_importacoes`) no Supabase do **JapView**, ou
     - Um data mart central (ex.: `analytics.fato_importacoes`).
5. **Consumo no Dashboard**:
   - JapView/JapSales leem das suas próprias tabelas/views (já consolidadas) para montar gráficos e KPIs.

Importante:

- Nenhum sistema faz `INSERT/UPDATE/DELETE` diretamente nas tabelas de outro sistema.
- A **integração sempre acontece**:
  - via **APIs REST** (comandos),
  - e/ou via **processos de leitura/replicação** (dados derivados).

##### 6.1.8.5. Garantias de Independência e Evolução

Para garantir que essa arquitetura continue saudável ao longo do tempo:

- **Contratos de Dados Versionados**:
  - Quando uma view/tabela “de integração” muda (ex.: `vw_pimp_historico`), a versão antiga é mantida por um tempo (`vw_pimp_historico_v1`, `_v2`, etc.).
  - Consumidores (JapView, JapMarket, Hub) migram gradualmente para a versão nova.

- **Migrações de Banco Isoladas por Sistema**:
  - Cada sistema mantém seu próprio diretório de migrações (ex.: `supabase/japimport/migrations/*`).
  - Não há migração compartilhada que afete múltiplos sistemas ao mesmo tempo.

- **Monitoramento de Latência e Frescor de Dados**:
  - Para integrações por banco (ETL/replicação), são definidos SLAs de frescor (ex.: dados atualizados a cada 15 minutos).
  - Para integrações por API (comandos), a latência é tratada como síncrona (resposta imediata).

- **Fallbacks Controlados**:
  - Se o sistema A estiver fora do ar, o sistema B continua operando com dados já replicados/históricos.
  - Quando a conexão é restabelecida, processos de sincronização reconstroem o estado.

Essa visão garante que:

- Cada módulo do JapBase é **fortemente independente** (frontend + backend + banco próprios).
- Ao mesmo tempo, é possível construir **uma visão unificada de negócio** através de:
  - APIs REST bem definidas (comandos),
  - e camadas de dados (views, data marts, replicação) desenhadas para **leitura e análise**, nunca para escrita cruzada entre sistemas.
- **Real-time**: Subscriptions via Supabase de cada sistema
- **Upload**: Storage de cada sistema via cliente específico
- **Edge Functions**: Chamadas via `supabase.functions.invoke()` de cada sistema

#### 6.1.9. Estratégia de Alto Volume de Dados

Para suportar **grande processamento e alto volume de dados**, cada sistema implementa estratégias específicas:

**1. Separação OLTP vs OLAP**:

- **OLTP (Write Models)**:
  - Tabelas normalizadas para transações rápidas
  - Exemplo: `japbase.pimps`, `japbase.pimp_pedidos_gripmaster`, `japbase.pimp_transito`
  - Índices em chaves estrangeiras e colunas frequentemente filtradas
  - Otimizadas para INSERT/UPDATE/DELETE rápidos
  - Integridade referencial garantida

- **OLAP (Read Models)**:
  - Views materializadas para consultas analíticas
  - Exemplo: `japbase.vw_pimp_historico` agrega múltiplas tabelas
  - Atualização via triggers ou cron jobs (não em tempo real)
  - Desnormalização estratégica para performance de leitura
  - Otimizadas para SELECT com agregações complexas

**2. Particionamento de Tabelas**:

- Tabelas históricas particionadas por período (ano, mês)
- Exemplo:
  ```sql
  CREATE TABLE pimps_2024 PARTITION OF pimps 
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
  CREATE TABLE pimps_2025 PARTITION OF pimps 
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
  ```
- Views unificadas agregam partições: `CREATE VIEW vw_pimp_historico AS SELECT * FROM pimps_2024 UNION ALL SELECT * FROM pimps_2025`
- Arquivo de dados antigos pode ser movido para storage cold (futuro)

**3. Views Materializadas**:

- Agregações pesadas pré-calculadas
- Exemplo:
  ```sql
  CREATE MATERIALIZED VIEW mv_vendas_mensais AS
  SELECT 
    DATE_TRUNC('month', data) as mes,
    SUM(valor_total) as total_vendas,
    COUNT(*) as num_vendas
  FROM view.fato_vendas
  GROUP BY DATE_TRUNC('month', data);
  ```
- Atualização incremental quando possível
- Refresh agendado (diário, semanal) conforme necessidade de frescor
- Índices específicos nas views materializadas para queries frequentes

**4. ETL e Data Marts**:

- Processos n8n ou Edge Functions replicam dados resumidos
- Data marts podem estar no mesmo Supabase (schema `analytics.*`) ou warehouse separado
- Permite análises pesadas sem degradar sistemas transacionais
- Exemplo: ETL diário que consolida dados de JapImport, JapView, JapMarket em `analytics.fato_consolidado`

**5. Índices Estratégicos**:

- Índices compostos em colunas de filtro/join frequentes
- Exemplo: `CREATE INDEX idx_pimps_status_exporter ON pimps(status, exporter)`
- Índices parciais para queries com filtros específicos
- Exemplo: `CREATE INDEX idx_pimps_ativos ON pimps(status) WHERE status != 'Concluído'`
- Índices GIN para buscas full-text quando necessário
- Exemplo: `CREATE INDEX idx_produtos_descricao_gin ON produtos USING gin(to_tsvector('portuguese', descricao))`

**6. Monitoramento e Otimização**:

- Query performance monitoring via Supabase Dashboard
- Análise de slow queries e otimização incremental
- Escalabilidade horizontal via read replicas quando necessário (futuro)
- Particionamento automático de tabelas grandes baseado em volume

**7. Estratégias por Sistema**:

- **JapImport**: Views materializadas para histórico consolidado (`vw_pimp_historico`), particionamento por ano
- **JapView**: Data warehouse com fato/dimensões, views materializadas para cubos analíticos
- **JapMarket**: Índices em preços por estado/data, views para comparações históricas
- **JapDistribution**: Simulações em tabelas temporárias, resultados consolidados em views
- **JapAudit**: Índices em notas fiscais por período, views para relatórios consolidados

#### 6.1.10. Migrações e Versionamento

- **Migrações SQL** versionadas no diretório `supabase/migrations/`
- **Versionamento de schemas** via Supabase CLI
- **Rollback** de migrações quando necessário
- **Ambientes separados**: desenvolvimento, staging, produção

#### 6.1.11. Variáveis de Ambiente (Multi-Sistema)

**Frontend JapBase Hub** (`.env.local`):
```
# Autenticação centralizada (se usar Supabase para auth)
NEXT_PUBLIC_SUPABASE_AUTH_URL=https://[auth-project].supabase.co
NEXT_PUBLIC_SUPABASE_AUTH_ANON_KEY=[chave_auth]

# APIs de cada sistema (recomendado)
NEXT_PUBLIC_JAPIMPORT_API_URL=https://api.japimport.japbase.com
NEXT_PUBLIC_JAPVIEW_API_URL=https://api.japview.japbase.com
NEXT_PUBLIC_JAPCATALOG_API_URL=https://api.japcatalog.japbase.com
# ... outros sistemas

# OU Supabase direto de cada sistema (desenvolvimento)
NEXT_PUBLIC_SUPABASE_JAPIMPORT_URL=https://[japimport-project].supabase.co
NEXT_PUBLIC_SUPABASE_JAPIMPORT_ANON_KEY=[chave_japimport]
NEXT_PUBLIC_SUPABASE_JAPVIEW_URL=https://[japview-project].supabase.co
NEXT_PUBLIC_SUPABASE_JAPVIEW_ANON_KEY=[chave_japview]
# ... outros sistemas
```

**Backend de cada Sistema** (`.env` de cada projeto):
```
# Exemplo: JapImport
SUPABASE_URL=https://[japimport-project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[chave_service_role_japimport]
SUPABASE_DB_URL=postgresql://[japimport-db]...
```

**Comunicação entre Sistemas**:
```
# No JapImport, para chamar JapView
JAPVIEW_API_URL=https://api.japview.japbase.com
JAPVIEW_API_KEY=[chave_api_japview]
```

#### 6.1.12. Principais Usos por Módulo

- **`JapImport`**:  
  - ✅ **Implementado**: Tabelas `pimps`, `pimps_produtos` (schema `public` para prototipagem)
  - ✅ Serviço de dados: `src/services/pimpsService.ts`
  - ✅ Cliente Supabase: `src/lib/supabaseClient.ts`
  - 🔄 Planejado: Tabelas `import.pimps_logs`, Edge Function para processar status de importadoras, Storage para documentos de importação

- **`JapCatalog`**:  
  - Tabelas `catalog.fichas_tecnicas`, `catalog.produtos`, `catalog.solicitacoes`  
  - Storage para PDFs de fichas técnicas
  - Edge Function para OCR de PDFs

- **`JapView`**:  
  - Tabelas `view.fato_vendas`, `view.dim_*` (dimensões)  
  - Views materializadas para performance
  - Real-time subscriptions para atualizações

- **`JapMarket`**:  
  - Tabelas `market.shopping_precos`, `market.historico_precos`  
  - Edge Function para processar planilhas de concorrentes

- **`JapDistribution`**:  
  - Tabelas `distribution.simulacoes`, `distribution.planos_aprovados`  
  - Edge Function para cálculos de distribuição

- **`JapAudit`**:  
  - Tabelas `audit.notas_fiscais`, `audit.divergencias`  
  - Edge Function para comparação de preços

- **`JapSales`**:  
  - Tabelas `sales.metas`, `sales.performance`  
  - Edge Function para envio de metas ao JapHub

> **Próximos passos técnicos**:  
> - Criar schemas SQL iniciais no Supabase  
> - Configurar variáveis de ambiente  
> - Implementar `src/lib/supabaseClient.ts`  
> - Criar Edge Functions básicas  
> - Configurar Row Level Security policies  
> - Implementar migrações versionadas

---

### 6.2. ERP – Sispro (Integração de Dados Operacionais)

- **Papel**:  
  - Fonte de verdade para produtos, SKUs, notas fiscais, clientes, estoque, preços.  

- **Ferramentas / camadas**:
  - API proprietária do Sispro (se existir) **ou**  
  - Integrações via **n8n** + banco intermediário (Supabase) + arquivos (CSV, TXT)  

- **Uso por módulos**:
  - `JapImport`: base de itens, SKUs, fornecedores, notas de importação  
  - `JapCatalog`: sincronia de produtos e vínculo com fichas técnicas  
  - `JapView` / `JapAudit` / Varejo & Atacado: notas fiscais, condições comerciais, histórico de vendas  

---

### 6.3. BI Legado – QlikView

- **Papel**:
  - Fonte de BI histórico desde 2013  
  - Referência para validação de resultados do `JapView`  

- **Integração**:
  - Extração periódica de cubos / tabelas (via exportações, conectores ou n8n)  
  - Carga em Supabase para alimentar o `JapView` (funil de vendas, potencial, análises por canal/estado/cliente)

---

### 6.4. Automação e Orquestração – n8n

- **Papel**:
  - Orquestrar integrações, ETLs leves e automações de negócio.  

- **Fluxos planejados**:
  - **JapImport**:  
    - Monitorar e-mails de compras (início de PIMP)  
    - Ler status de importadoras / portais (web scraping / APIs)  
    - Atualizar status de PIMPs no Supabase  
  - **JapCatalog**:  
    - Fila de solicitações de fichas técnicas  
    - Notificações (email/WhatsApp) para responsáveis  
  - **JapMarket**:  
    - Importar planilhas de concorrentes  
    - Disparar jobs de OCR + IA para padronização de descrições  
  - **JapAudit**:  
    - Rodar processos mensais de auditoria (batch)  
    - Gerar relatórios em Excel e salvar no Storage Supabase  

---

### 6.5. APIs Externas – Câmbio, Calendário, Marketplaces

#### 6.5.1. API de Cotação do Dólar

- **Uso principal**: `JapImport`  
- Requisitos:
  - Cotação do dia (Dólar comercial)  
  - Histórico para reprocessamento de PIMPs antigos  
  - Endpoint estável (ex.: AwesomeAPI, Banco Central, ExchangeRate API, etc.)  

#### 6.5.2. APIs de Calendário / Dias Úteis

- **Uso**:
  - Cálculo de prazos de importação, SLAs e metas (JapImport / JapDistribution / Auditoria)  
  - Considerar feriados nacionais e regionais  

#### 6.5.3. Marketplaces (ex.: Bemol)

- **Uso**:
  - Gestão de produtos, EANs, status de publicação  
  - Monitoramento automático de cadastros / preços / disponibilidade  
  - Integração prevista para módulos futuros de Varejo & Marketplaces

---

### 6.6. Inteligência Artificial – APIs de IA

- **Casos de uso principais**:
  - **Normalização de descrições** (JapMarket, JapCatalog, JapLevel)  
  - **Sugestões de preço** (JapMarket, JapPricing futuro)  
  - **Sugestão de compras / containers** (JapImport, JapDistribution)  
  - **Análises textuais e sumarização de logs** (logs de auditoria, alertas, notícias internas)  

- **Ferramentas possíveis**:
  - OpenAI, Anthropic, local LLMs via API, ou provedores equivalentes  

- **Requisitos técnicos**:
  - Camada de serviço própria (ex.: `src/services/aiClient.ts`) para não acoplar o frontend diretamente às APIs externas  
  - Armazenamento de prompts e respostas relevantes em Supabase para rastreabilidade

---

### 6.7. OCR – Leitura Automática de Planilhas / PDFs

- **Uso**:
  - **JapMarket**: planilhas de concorrentes, listas de preço escaneadas  
  - **Fichas Técnicas**: PDFs de fabricantes, catálogos  

- **Ferramentas possíveis**:
  - Serviços cloud (Google Vision, AWS Textract, Azure OCR)  
  - Ou stack self-hosted (Tesseract + n8n + Supabase Storage)  

- **Fluxo recomendado**:
  - Upload no frontend → Storage Supabase → Trigger n8n → OCR → IA para normalização → gravação estruturada no Supabase

---

### 6.8. Cursor – Ferramenta de Desenvolvimento

- **Papel no projeto**:
  - IDE + agente de IA (este assistente) para:  
    - Refatoração contínua dos módulos  
    - Geração de boilerplate de telas / módulos novos  
    - Manutenção da documentação (`DOCUMENTACAO.md`, `README.md`)  
    - Criação rápida de testes e scripts de integração  

- **Boas práticas**:
  - Manter esta documentação sempre atualizada conforme novos módulos forem criados  
  - Usar o Cursor para gerar esboços de UI, mas consolidar regras de negócio no backend/Supabase/n8n  

---

---

## 7. Roadmap Técnico (Resumo)

### 7.1. Frontend

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Bibliotecas principais**:
  - React 18+ (hooks, componentes funcionais)
  - Framer Motion (animações)
  - Lucide React (ícones)
  - @supabase/supabase-js (cliente Supabase)

### 7.2. Backend

- **Arquitetura**: Multi-Sistema (cada módulo = sistema separado)
- **Plataforma por Sistema**: Supabase (um Supabase por módulo)
- **Banco de Dados**: PostgreSQL (um banco isolado por sistema)
- **Linguagens**:
  - **TypeScript** (Edge Functions, scripts, tipos compartilhados)
  - **SQL** (schemas, views, stored procedures, triggers, RLS policies)
  - **Deno** (runtime para Edge Functions)
- **Serviços Supabase** (por sistema):
  - PostgreSQL Database (isolado)
  - Authentication (JWT, Row Level Security)
  - Storage (arquivos, documentos)
  - Edge Functions (serverless)
  - Real-time (subscriptions)
  - API REST (auto-gerada)
- **Comunicação**: APIs REST entre sistemas

### 7.3. Automação e Integração

- **n8n**: Orquestração de workflows e ETLs
- **APIs REST**: Comunicação com sistemas externos (JapHub, Sispro)
- **Webhooks**: Eventos em tempo real

### 7.4. Ferramentas de Desenvolvimento

- **Cursor**: IDE com IA para desenvolvimento
- **Supabase CLI**: Gerenciamento de migrações e Edge Functions
- **Git**: Controle de versão
- **npm/yarn**: Gerenciamento de dependências

---

## 8. Arquitetura Evolutiva: Monorepo Polissistêmico → Polirepo por Sistema

### 8.1. Arquitetura Atual: Monorepo Polissistêmico

**Estado Atual** (2025):

- **Repositório**: Monorepo único (`japbase/`)
- **Estrutura**: Organizada em `apps/*` (um app = um sistema/Bounded Context)
- **Banco de Dados**: Cada sistema possui Supabase próprio (isolado)
- **Comunicação**: Via contratos explícitos (APIs, views, data products)
- **Vantagens**:
  - Refatoração cross-sistema facilitada
  - Tipos compartilhados via `packages/contracts`
  - Design System unificado via `packages/ui`
  - CI/CD unificado para validação de contratos
  - Desenvolvimento rápido e iterativo

**Preparação para Extração**:

- Código de cada sistema isolado em `apps/{sistema}/`
- Contratos em `packages/contracts` (publicável como npm)
- Zero acoplamento direto de código entre sistemas
- Migrações e Edge Functions organizadas por sistema
- Estrutura permite extração sem retrabalho estrutural

**Fases de Desenvolvimento Atual**:

- **Fase 1 – Frontend & Design System (EM ANDAMENTO)**  
  - Layout JapBase v2  
  - Módulos esquelos: JapImport, JapView, JapCatalog, JapMarket, JapDistribution, JapAudit, DashboardHome  
  - Componentes UI reutilizáveis em `packages/ui`

- **Fase 2 – Backend & Supabase (Polissistêmico)**  
  - Configuração de projetos Supabase separados (um por módulo)
  - Criação de bancos de dados isolados por sistema
  - Criação de schemas SQL em cada banco
  - Separação Write Models (OLTP) e Read Models (OLAP)
  - Configuração de Row Level Security (RLS) por sistema
  - Implementação de clientes Supabase no frontend (um por sistema ou APIs REST)
  - Criação de Edge Functions básicas por sistema
  - Configuração de Storage buckets por sistema
  - Migrações versionadas por sistema em `apps/{sistema}/supabase/migrations/`
  - Implementação de APIs REST para comunicação entre sistemas
  - Definição de contratos em `packages/contracts`

- **Fase 3 – Integrações & Dados**  
  - Conectores Sispro → Supabase → Frontend
  - Migração de dados históricos do QlikView
  - Integração com APIs externas (câmbio, etc.)
  - Sincronização de dados operacionais
  - ETLs para construção de data marts

- **Fase 4 – Automação & n8n**  
  - Fluxos de importação, auditoria, fichas e shopping de preços
  - ETLs para sincronização de dados entre sistemas
  - Webhooks e eventos em tempo real
  - Processos de replicação para data marts

- **Fase 5 – IA & OCR**  
  - Normalização de descrições, sugestões de preços, recomendações de distribuição e compras
  - OCR para processamento de PDFs e planilhas
  - Assistente de IA integrado

- **Fase 6 – Portais Externos (JapHub / B2B)**  
  - Expansão para usuários internos (JapHub) e clientes (B2B)
  - APIs de integração com JapHub

### 8.2. Arquitetura Alvo: Polirepo por Sistema

**Estado Futuro** (quando sistemas atingirem maturidade):

- **Repositórios**: Um repo Git por sistema (`japimport/`, `japview/`, etc.)
- **Deploy**: Independente por sistema (CI/CD próprio)
- **Banco de Dados**: Mantém Supabase próprio (sem mudança)
- **Comunicação**: Mantém contratos explícitos (APIs, views, data products)
- **Vantagens**:
  - Autonomia operacional completa por sistema
  - Escalabilidade independente de infraestrutura
  - Times podem trabalhar sem coordenação de deploy
  - Isolamento de segurança e compliance por sistema
  - Versionamento independente de dependências

**Migração Sem Retrabalho**:

- Copiar `apps/{sistema}/` para novo repo
- Publicar `packages/contracts` como `@japbase/contracts` (npm)
- Atualizar imports no JapBase Hub para consumir APIs
- Zero refatoração estrutural necessária

**Critérios de Extração**:

Ver seção **2.5.6. Critérios para Extração para Polirepo** para critérios objetivos de quando um módulo deve ser extraído.

### 8.3. Estratégia de Evolução Contínua

**Princípios**:

- **Evolução incremental**: Sistemas são extraídos quando atingem maturidade, não todos de uma vez
- **Compatibilidade retroativa**: Contratos mantidos durante período de transição
- **Zero downtime**: Extração não interrompe operação dos sistemas
- **Documentação**: Cada extração documentada como ADR (Architecture Decision Record)

**Processo de Extração**:

1. **Preparação** (no monorepo):
   - Validar que código está em `apps/{sistema}/`
   - Validar que contratos estão em `packages/contracts`
   - Documentar dependências e integrações

2. **Extração**:
   - Criar novo repositório Git
   - Copiar `apps/{sistema}/` para raiz do novo repo
   - Configurar CI/CD independente
   - Publicar `packages/contracts` como pacote npm

3. **Migração**:
   - Atualizar imports no JapBase Hub para consumir APIs do sistema extraído
   - Manter compatibilidade durante período de transição
   - Desativar código antigo após validação
  - Autenticação e autorização entre sistemas

---


## 9. Estratégia de Prototipagem Rápida (Fase Inicial)

### 9.1. Por Que Prototipar Antes de Separar?

**Resposta direta**: **SIM, comece montando fluxos no n8n para importar planilhas para o Supabase**, mas com uma abordagem de **prototipagem rápida primeiro**.

**Razões para prototipar antes de separar em sistemas**:

1. **Validação rápida com dados reais**:
   - Testar o conceito antes de investir em arquitetura complexa
   - Diretoria vê resultados concretos rapidamente
   - Ajustes são mais fáceis quando tudo está junto

2. **Menos complexidade inicial**:
   - Um Supabase único é mais simples de gerenciar
   - Schemas podem ser ajustados rapidamente
   - Menos pontos de falha

3. **Iteração rápida**:
   - Mudanças de schema são mais fáceis
   - Testes de integração são mais simples
   - Debugging é mais direto

4. **Migração futura facilitada**:
   - Depois de validado, migrar para sistemas separados será mais fácil
   - Você já terá os schemas definidos
   - Dados já estarão estruturados

### 9.2. Passo a Passo Recomendado para Prototipagem

#### Passo 1: Criar UM Supabase para Prototipagem

```bash
# 1. Criar projeto no Supabase Dashboard
# Nome: japbase-prototype (ou japbase-dev)
# Região: escolher mais próxima ao Brasil
# Senha do banco: gerar e salvar em local seguro

# 2. Instalar Supabase CLI
npm install -g supabase

# 3. No projeto atual (japbase), inicializar Supabase
cd c:\Users\User\japbase
supabase init

# 4. Linkar com projeto remoto
supabase link --project-ref [project-ref-do-supabase]

# 5. Criar estrutura de schemas (todos juntos inicialmente)
supabase migration new initial_prototype_schemas
```

#### Passo 2: Criar Schemas Baseados nas Planilhas Atuais

**Estratégia**: Criar schemas que espelham as planilhas Excel atuais, facilitando a importação.

```sql
-- supabase/migrations/[timestamp]_initial_prototype_schemas.sql

-- Schema import (baseado na planilha de PIMPs)
CREATE SCHEMA IF NOT EXISTS import;

CREATE TABLE import.pimps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  fornecedor VARCHAR(255) NOT NULL,
  produto VARCHAR(255),
  quantidade INTEGER NOT NULL,
  valor_usd DECIMAL(15,2) NOT NULL,
  valor_brl DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  data_inicio DATE NOT NULL,
  data_prevista DATE,
  data_finalizacao DATE,
  row_color VARCHAR(7) DEFAULT '#FFFFFF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema view (baseado nos dados do Sispro/QlikView)
CREATE SCHEMA IF NOT EXISTS view;

CREATE TABLE view.fato_vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nota_fiscal VARCHAR(50),
  data DATE NOT NULL,
  cliente_id UUID,
  vendedor VARCHAR(255),
  estado VARCHAR(2),
  cidade VARCHAR(255),
  unidade VARCHAR(255),
  canal VARCHAR(50),
  produto_id UUID,
  quantidade INTEGER,
  valor_unitario DECIMAL(15,2),
  valor_total DECIMAL(15,2),
  desconto DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema market (baseado nas planilhas de preços)
CREATE SCHEMA IF NOT EXISTS market;

CREATE TABLE market.shopping_precos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto VARCHAR(255) NOT NULL,
  medida VARCHAR(50),
  nosso_preco DECIMAL(10,2),
  concorrente1_nome VARCHAR(255),
  concorrente1_preco DECIMAL(10,2),
  concorrente2_nome VARCHAR(255),
  concorrente2_preco DECIMAL(10,2),
  concorrente3_nome VARCHAR(255),
  concorrente3_preco DECIMAL(10,2),
  economia DECIMAL(10,2),
  variacao DECIMAL(5,2),
  estado VARCHAR(2),
  data_analise DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ... outros schemas conforme necessário
```

#### Passo 3: Montar Fluxos n8n para Importar Planilhas

**Workflow 1: Importar Planilha de PIMPs**

```
n8n Workflow: import-pimps-excel
├── Trigger: Manual ou Agendado
├── Node: Read Binary Files (ler planilha Excel)
├── Node: Process Excel (parsear linhas)
├── Node: Transform Data (mapear colunas Excel → Supabase)
├── Node: Supabase Insert (inserir em import.pimps)
└── Node: Notify (notificar sucesso/erro)
```

**Exemplo de mapeamento n8n**:
```javascript
// Node: Transform Data
// Mapear colunas da planilha Excel para campos do Supabase

items.map(item => ({
  numero: item.json['Número PIMP'],
  fornecedor: item.json['Fornecedor'],
  produto: item.json['Produto'],
  quantidade: parseInt(item.json['Quantidade']),
  valor_usd: parseFloat(item.json['Valor USD']),
  valor_brl: parseFloat(item.json['Valor BRL']),
  status: item.json['Status'],
  data_inicio: item.json['Data Início'],
  data_prevista: item.json['Data Prevista']
}))
```

**Workflow 2: Importar Dados de Vendas do Sispro**

```
n8n Workflow: sync-sispro-vendas
├── Trigger: Agendado (diário às 2h da manhã)
├── Node: Database Query (conectar ao Sispro)
├── Node: Transform Data (normalizar dados)
├── Node: Supabase Upsert (atualizar view.fato_vendas)
└── Node: Log Result
```

**Workflow 3: Importar Planilhas de Preços**

```
n8n Workflow: import-precos-concorrentes
├── Trigger: Manual ou quando arquivo é enviado
├── Node: Google Drive / Email (buscar planilha)
├── Node: Process Excel
├── Node: Transform Data
└── Node: Supabase Insert (market.shopping_precos)
```

#### Passo 4: Conectar Frontend ao Supabase

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

```typescript
// src/services/pimpsService.ts
import { supabase } from '@/lib/supabaseClient'

export async function getPimps() {
  const { data, error } = await supabase
    .from('pimps')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
```

#### Passo 5: Validar e Ajustar

1. **Importar dados** via n8n
2. **Visualizar no frontend** (JapImport, JapView, etc.)
3. **Validar com a diretoria**
4. **Ajustar schemas** se necessário
5. **Refinar fluxos n8n**

### 9.3. Quando Separar em Sistemas?

**Sinais de que é hora de separar**:

- ✅ Protótipo está validado pela diretoria
- ✅ Schemas estão estáveis (poucas mudanças)
- ✅ Fluxos n8n estão funcionando bem
- ✅ Performance começa a ser um problema
- ✅ Equipe precisa trabalhar em paralelo
- ✅ Necessidade de deploy independente

**Processo de Separação** (quando chegar a hora):

1. Criar novos projetos Supabase (um por sistema)
2. Migrar dados do protótipo para sistemas separados
3. Ajustar frontend para apontar para Supabase correto
4. Implementar APIs REST entre sistemas
5. Deploy separado

### 9.4. Checklist de Prototipagem

- [ ] **Setup Supabase**
  - [ ] Criar projeto no Supabase Dashboard
  - [ ] Configurar Supabase CLI
  - [ ] Criar schemas baseados nas planilhas
  - [ ] Aplicar migrações

- [ ] **Importação de Dados**
  - [ ] Criar workflow n8n para planilha de PIMPs
  - [ ] Criar workflow n8n para dados de vendas (Sispro)
  - [ ] Criar workflow n8n para planilhas de preços
  - [ ] Testar importação completa
  - [ ] Validar dados importados

- [ ] **Integração Frontend**
  - [ ] Instalar @supabase/supabase-js
  - [ ] Criar cliente Supabase
  - [ ] Criar serviços de dados
  - [ ] Conectar componentes aos dados reais
  - [ ] Testar visualizações

- [ ] **Validação**
  - [ ] Mostrar para diretoria
  - [ ] Coletar feedback
  - [ ] Ajustar conforme necessário

---

## 10. Planejamento para Extração para Polirepo (Futuro)

Esta seção detalha o **planejamento completo** e **passo a passo prático** para transformar os módulos do JapBase em sistemas completamente separados, cada um com seu próprio Supabase e projeto. **Execute esta etapa APÓS validar o protótipo**.

### 9.1. Estrutura de Projetos Separados

**Decisão Arquitetural**: Cada módulo será um **projeto completamente separado** (não monorepo inicialmente).

**Estrutura de Projetos**:

```
japbase-hub/                    # Projeto separado - Shell/Orquestrador
├── frontend/                   # Next.js
├── package.json
└── README.md

japimport/                      # Projeto separado - Sistema JapImport
├── frontend/                   # Next.js
├── supabase/                   # Supabase do JapImport
│   ├── migrations/
│   ├── functions/
│   └── config.toml
├── package.json
└── README.md

japview/                        # Projeto separado - Sistema JapView
├── frontend/                   # Next.js
├── supabase/                   # Supabase do JapView
│   ├── migrations/
│   ├── functions/
│   └── config.toml
├── package.json
└── README.md

japcatalog/                     # Projeto separado - Sistema JapCatalog
├── frontend/
├── supabase/
├── package.json
└── README.md

... (outros sistemas)
```

**Vantagens de Projetos Separados**:
- Deploy completamente independente
- Repositórios Git separados (ou monorepo com workspaces)
- Equipes podem trabalhar isoladamente
- Escalabilidade independente
- Tecnologias podem divergir se necessário

### 9.2. Passo a Passo Detalhado

#### Fase 1: Preparação e Setup Inicial

**Passo 1.1: Criar Projeto Supabase para JapImport**
```bash
# 1. Criar projeto no Supabase Dashboard
# Nome: japimport-prod
# Região: escolher mais próxima
# Senha do banco: gerar e salvar

# 2. Instalar Supabase CLI
npm install -g supabase

# 3. Inicializar projeto Supabase localmente
cd japimport/
supabase init

# 4. Linkar com projeto remoto
supabase link --project-ref [project-ref]

# 5. Criar primeira migração
supabase migration new initial_schema
```

**Passo 1.2: Criar Schema SQL para JapImport**
```sql
-- supabase/migrations/[timestamp]_initial_schema.sql

-- Schema import
CREATE SCHEMA IF NOT EXISTS import;

-- Tabela de PIMPs
CREATE TABLE import.pimps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  fornecedor VARCHAR(255) NOT NULL,
  produto VARCHAR(255),
  quantidade INTEGER NOT NULL,
  valor_usd DECIMAL(15,2) NOT NULL,
  valor_brl DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  data_inicio DATE NOT NULL,
  data_prevista DATE,
  data_finalizacao DATE,
  row_color VARCHAR(7) DEFAULT '#FFFFFF',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos do PIMP
CREATE TABLE import.pimps_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pimp_id UUID REFERENCES import.pimps(id) ON DELETE CASCADE,
  descricao VARCHAR(500) NOT NULL,
  medida VARCHAR(50),
  modelo VARCHAR(100),
  marca VARCHAR(100),
  quantidade INTEGER NOT NULL,
  valor_unitario_usd DECIMAL(10,2) NOT NULL,
  valor_total_usd DECIMAL(15,2) NOT NULL,
  valor_total_brl DECIMAL(15,2) NOT NULL,
  transportadora VARCHAR(100),
  eta DATE,
  container VARCHAR(50),
  lote VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs
CREATE TABLE import.pimps_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pimp_id UUID REFERENCES import.pimps(id) ON DELETE CASCADE,
  origem VARCHAR(20) NOT NULL, -- 'manual' ou 'n8n'
  acao VARCHAR(100) NOT NULL,
  detalhes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pimps_status ON import.pimps(status);
CREATE INDEX idx_pimps_fornecedor ON import.pimps(fornecedor);
CREATE INDEX idx_pimps_produtos_pimp ON import.pimps_produtos(pimp_id);

-- RLS Policies
ALTER TABLE import.pimps ENABLE ROW LEVEL SECURITY;
ALTER TABLE import.pimps_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE import.pimps_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários autenticados podem ler
CREATE POLICY "Users can read pimps" ON import.pimps
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Apenas diretores podem modificar
CREATE POLICY "Directors can modify pimps" ON import.pimps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'director'
    )
  );
```

**Passo 1.3: Criar Projeto Next.js para JapImport**
```bash
# Criar novo projeto Next.js
npx create-next-app@latest japimport-frontend --typescript --tailwind --app

# Instalar dependências do Supabase
cd japimport-frontend/
npm install @supabase/supabase-js @supabase/ssr

# Criar estrutura de pastas
mkdir -p src/lib src/services src/components/modules
```

**Passo 1.4: Configurar Cliente Supabase no Frontend**
```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Passo 1.5: Criar Camada de Serviço (API)**
```typescript
// src/services/pimpsService.ts
import { supabase } from '@/lib/supabaseClient'

export interface Pimp {
  id: string
  numero: string
  fornecedor: string
  produto: string
  quantidade: number
  valorUsd: number
  valorBrl: number
  status: string
  dataInicio: string
  dataPrevista: string
  dataFinalizacao?: string
}

export async function getPimps(status?: string): Promise<Pimp[]> {
  let query = supabase.from('pimps').select('*').order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createPimp(pimp: Partial<Pimp>): Promise<Pimp> {
  const { data, error } = await supabase
    .from('pimps')
    .insert(pimp)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ... outros métodos
```

#### Fase 2: Automação e Integrações

**Passo 2.1: Configurar n8n para Monitoramento de Email**

1. **Criar workflow no n8n**:
   - Trigger: Email (IMAP) - monitora caixa do Marcus
   - Filtro: Assunto contém "PIMP" ou padrão específico
   - Ação: Extrair anexos (PDFs, Excel, etc.)

2. **Workflow de Extração de Dados**:
   - Node: OCR (Google Vision ou Tesseract)
   - Node: IA para estruturação (OpenAI/Claude)
   - Node: Validação de dados extraídos
   - Node: Webhook para criar PIMP no Supabase

**Passo 2.2: Criar Edge Function para Processar PIMPs**
```typescript
// supabase/functions/process-pimp/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { pimpData, extractedData } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  // Criar PIMP e produtos
  const { data: pimp, error } = await supabase
    .from('pimps')
    .insert({
      ...pimpData,
      produtos: extractedData.produtos
    })
    .select()
    .single()
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response(JSON.stringify({ success: true, pimp }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

**Passo 2.3: Configurar Automação de Status de Cargas**
```typescript
// n8n workflow: check-container-status
// 1. Buscar PIMPs com status "Em Trânsito"
// 2. Para cada container, consultar API da transportadora
// 3. Atualizar status no Supabase via Edge Function
```

#### Fase 3: Criar API REST para Comunicação entre Sistemas

**Passo 3.1: Criar Edge Function de API**
```typescript
// supabase/functions/api-pimps/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Verificar autenticação
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401
    })
  }
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  const url = new URL(req.url)
  const path = url.pathname
  
  // GET /api/v1/pimps
  if (req.method === 'GET' && path.includes('/pimps')) {
    const status = url.searchParams.get('status')
    
    let query = supabase.from('pimps').select('*')
    if (status) query = query.eq('status', status)
    
    const { data, error } = await query
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400
      })
    }
    
    return new Response(JSON.stringify({
      data,
      meta: {
        total: data?.length || 0,
        page: 1,
        per_page: 20
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404
  })
})
```

**Passo 3.2: Configurar CORS e Autenticação entre Sistemas**
```typescript
// Adicionar headers CORS nas Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validar token de serviço
const serviceToken = req.headers.get('X-Service-Token')
if (serviceToken !== Deno.env.get('SERVICE_TOKEN')) {
  return new Response(JSON.stringify({ error: 'Invalid service token' }), {
    status: 401
  })
}
```

#### Fase 4: Repetir para Outros Sistemas

**Passo 4.1: Criar JapView (Sistema Separado)**

1. Criar projeto Supabase para JapView
2. Criar schema SQL com tabelas fact/dim
3. Configurar ETL n8n: Sispro → Supabase JapView
4. Criar projeto Next.js para JapView
5. Implementar visualizações e dashboards
6. Criar API REST para outros sistemas consumirem

**Passo 4.2: Configurar Comunicação JapView ↔ JapImport**

No JapView, criar serviço para consumir API do JapImport:
```typescript
// japview/src/services/japimportService.ts
const JAPIMPORT_API_URL = process.env.NEXT_PUBLIC_JAPIMPORT_API_URL!

export async function getImportacoesFuturas() {
  const response = await fetch(`${JAPIMPORT_API_URL}/api/v1/pimps?status=em_transito`, {
    headers: {
      'Authorization': `Bearer ${process.env.JAPIMPORT_SERVICE_TOKEN}`,
      'X-Service-Token': process.env.JAPIMPORT_SERVICE_TOKEN!
    }
  })
  
  const data = await response.json()
  return data.data
}
```

### 9.3. Checklist de Implementação por Sistema

Para cada sistema (JapImport, JapView, etc.), seguir este checklist:

- [ ] **1. Setup Supabase**
  - [ ] Criar projeto no Supabase Dashboard
  - [ ] Configurar Supabase CLI localmente
  - [ ] Criar schema SQL inicial
  - [ ] Configurar RLS policies
  - [ ] Criar migrações versionadas

- [ ] **2. Setup Frontend**
  - [ ] Criar projeto Next.js
  - [ ] Configurar cliente Supabase
  - [ ] Criar camada de serviços/API
  - [ ] Implementar componentes do módulo
  - [ ] Configurar variáveis de ambiente

- [ ] **3. Automações**
  - [ ] Configurar workflows n8n específicos
  - [ ] Criar Edge Functions necessárias
  - [ ] Configurar webhooks e triggers

- [ ] **4. API REST**
  - [ ] Criar Edge Functions de API
  - [ ] Documentar endpoints
  - [ ] Configurar autenticação entre sistemas
  - [ ] Implementar versionamento de API

- [ ] **5. Integração com JapBase Hub**
  - [ ] Configurar rota no Hub para o sistema
  - [ ] Implementar autenticação SSO
  - [ ] Testar comunicação Hub ↔ Sistema

- [ ] **6. Deploy**
  - [ ] Deploy do Supabase (produção)
  - [ ] Deploy do Frontend (Vercel)
  - [ ] Configurar domínio/subdomínio
  - [ ] Configurar CI/CD

### 9.4. Estrutura de Repositórios

**Opção 1: Repositórios Separados** (Recomendado inicialmente)
```
github.com/japura/
├── japbase-hub
├── japimport
├── japview
├── japcatalog
├── japmarket
└── ...
```

**Opção 2: Monorepo com Workspaces** (Futuro)
```
japbase/
├── packages/
│   ├── ui/              # Design System compartilhado
│   ├── config/          # Configs compartilhadas
│   └── types/           # Tipos TypeScript compartilhados
├── apps/
│   ├── hub/             # JapBase Hub
│   ├── japimport/       # Sistema JapImport
│   ├── japview/         # Sistema JapView
│   └── ...
└── package.json         # Workspace root
```

### 9.5. Ordem Recomendada de Implementação

1. **JapImport** (mais isolado, fluxo claro)
2. **JapView** (consome dados do Sispro, base para outros)
3. **JapCatalog** (relativamente independente)
4. **JapMarket** (pode consumir dados do JapCatalog)
5. **JapDistribution** (consome JapImport e JapView)
6. **JapAudit** (consome JapView e JapMarket)
7. **JapSales** (consome JapView)

### 9.6. Documentação de APIs entre Sistemas

Cada sistema deve documentar suas APIs REST:

```markdown
# API JapImport

## Endpoints

### GET /api/v1/pimps
Lista PIMPs com filtros opcionais.

**Query Parameters**:
- `status` (opcional): Filtrar por status

**Response**:
```json
{
  "data": [...],
  "meta": {
    "total": 10,
    "page": 1,
    "per_page": 20
  }
}
```

**Autenticação**: Bearer token ou X-Service-Token
```

---

## 11. Primeiros Passos para Segmentar o JapBase (Referência Histórica)

### 10.1. Organização de Código (Futuro Monorepo)

Plano inicial de organização em **monorepo**, pensando em Vercel + Supabase:

- Raiz do repositório (futuro):
  - `apps/`
    - `japbase-shell/` → Shell principal (hub, layout, rota `/`)
    - `jap-import/` → Frontend do módulo JapImport
    - `jap-view/` → Frontend do módulo JapView
    - `jap-audit/` → Frontend do módulo JapAudit
    - `jap-distribution/` → Frontend do módulo JapDistribution
    - `jap-market/` → Frontend do módulo JapMarket
    - `jap-catalog/` → Frontend do módulo JapCatalog
  - `packages/`
    - `ui/` → Componentes React compartilhados (Cards, Tabelas Excel, Botões etc.)
    - `config/` → Tailwind config, ESLint, TSConfig, etc.
    - `types/` → Tipos TypeScript de domínio (PIMP, NF, Produto, Cliente, etc.)

**Situação atual**: tudo está em um único app (`src/app`, `src/components`).  
**Primeiro passo prático**: manter esse app estável e **evoluir o design e os módulos**, preparando o terreno para migrar para monorepo mais à frente.

### 10.2. Passo a Passo – Curto Prazo (Dentro do Projeto Atual)

1. **Padronizar módulos** no app atual:
   - Garantir que cada módulo (`JapImport`, `JapView`, `JapAudit`, etc.) está bem isolado em `src/components/modules` com fronteiras claras (props, tipos).
   - Evitar dependências cruzadas confusas (um módulo importando componente interno de outro sem passar por interfaces claras).

2. **Centralizar Design System**:
   - Transformar os componentes visuais (`KpiCard`, tabelas estilo Excel, botões, inputs, etc.) em uma mini lib: hoje em `src/components/ui`, depois migrável para `packages/ui`.

3. **Introduzir camada de API isolada**:
   - Criar uma pasta `src/services/` (ou `src/lib/api/`) com funções do tipo:
     - `getPimps()`, `getPimpById(id)`, `getAuditReport()`, etc.
   - Isso facilitará, no futuro, apontar cada serviço para **APIs de módulos diferentes** sem mudar as telas.

4. **Mapear dependências de dados por módulo** (documental):
   - JapImport → quais tabelas / API endpoints precisa.
   - JapView → quais dados de Import, Audit, Market, etc. ele consome.
   - Registrar isso aqui no `DOCUMENTACAO.md` antes da segmentação real.

### 10.3. Passo a Passo – Médio Prazo (Quando iniciarmos a segmentação real)

1. **Criar Monorepo** (ex.: Turborepo ou Nx):
   - Migrar o app atual para dentro de `apps/japbase-shell`.
   - Criar `packages/ui`, `packages/config`, `packages/types`.

2. **Criar primeiro módulo separado** (piloto):
   - Escolher um módulo com fronteira clara (ex.: `JapImport`).
   - Criar app `apps/jap-import` na mesma repo.
   - Reusar componentes de `packages/ui` e tipos de `packages/types`.
   - Configurar projeto JapImport na Vercel (domínio ex.: `import.japbase.com`).

3. **Conectar Shell → Módulo**:
   - No Shell (JapBase):
     - Adicionar links/rotas que apontam para `https://import.japbase.com` (ou embed via iframe se desejado).
   - Garantir que autenticação/SSO esteja funcionando entre Shell e módulo.

4. **Repetir o padrão para os outros módulos** (View, Audit, Market, etc.):
   - Sempre reutilizando o Design System e os tipos.

### 10.4. Problemas Futuros Antecipados e Estratégias

- **Problema: Deploy de um módulo quebrando o sistema inteiro**  
  → Solução: Deploy por módulo na Vercel + Shell estável que mostra “Módulo em manutenção” quando algum subdomínio estiver fora.

- **Problema: Divergência de UI entre módulos**  
  → Solução: Design System único em `packages/ui` + Tailwind config compartilhado.

- **Problema: Dependência forte entre módulos (ex.: JapView dependente demais de JapImport)**  
  → Solução: Definir **contratos de API** claros (DTOs) e documentados; usar camadas de serviço (`src/services`) e não “pular direto no banco do outro”.

- **Problema: Migrações de banco afetando vários módulos**  
  → Solução: Ownership por schema em Supabase (cada módulo dono de um conjunto de tabelas) + migrações versionadas por módulo.

- **Problema: Performance com muitos dados**  
  → Solução: Projeções e views específicas para o `JapView`, em vez de cada módulo ler diretamente as tabelas operacionais.

---

## 11. Frase-Síntese Oficial

> **O JapImport gerencia importações.**  
> **O JapMarket define preços.**  
> **O JapDistribution planeja logística.**  
> **O JapSales direciona a força comercial.**  
> **O JapHub executa.**  
> **O JapBase decide.**

---

## 12. Como Contribuir

- Manter a arquitetura modular (`modules`, `ui`, `layout`)  
- Respeitar o Design System Japurá 2025 (cores, tipografia, espaçamentos)  
- Atualizar este `DOCUMENTACAO.md` sempre que:
  - um novo módulo for criado ou alterado de forma relevante  
  - uma nova integração externa for adicionada  
  - mudanças de arquitetura (ex.: migração de banco, novos serviços) forem aprovadas pela diretoria

