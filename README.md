# JapBase - Ecossistema Corporativo Estratégico

> Plataforma estratégica corporativa da Japurá Pneus desenvolvida como **Monorepo Polissistêmico Evolutivo**.

## 📋 Visão Geral

O JapBase é um **ecossistema corporativo estratégico** construído com arquitetura polissistêmica, onde cada módulo representa um **Bounded Context** independente com ownership claro de dados.

### Arquitetura

- **Hoje**: Monorepo estrutural (`apps/*`, `packages/*`)
- **Amanhã**: Polirepo por sistema (extração sem retrabalho estrutural)

## 🏗️ Estrutura do Repositório

```
japbase/
├── apps/                    # Aplicações (um app = um sistema/Bounded Context)
│   ├── japbase-hub/         # Shell/Orquestrador (JapBase Hub)
│   └── japimport/           # Sistema JapImport
│
├── packages/                # Pacotes compartilhados (sem lógica de negócio)
│   ├── ui/                  # Design System (componentes React/Tailwind)
│   └── contracts/           # Contratos de Integração (TypeScript types)
│
├── infra/                   # Infraestrutura e automação
│   ├── sql/                 # Scripts SQL compartilhados
│   ├── n8n/                 # Workflows n8n (ETLs, automações)
│   └── etl/                 # Scripts de ETL e data pipeline
│
└── docs/                    # Documentação
    ├── arquitetura/         # Decisões arquiteturais (ADRs)
    ├── contratos/           # Documentação de APIs e contratos
    └── guias/               # Guias de desenvolvimento
```

## 🚀 Início Rápido

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
# Rodar JapBase Hub (Shell/Orquestrador)
npm run dev:hub

# Rodar JapImport (sistema específico)
npm run dev:import
```

### Build

```bash
# Build de todos os apps
npm run build

# Build específico
npm run build:hub
npm run build:import
```

## 📚 Documentação

Consulte `DOCUMENTACAO.md` para:
- Arquitetura detalhada
- Decisões arquiteturais (ADRs)
- Contratos de integração
- Guias de desenvolvimento

## 🏛️ Princípios Arquiteturais

1. **Bounded Contexts Independentes**: Cada módulo é um domínio de negócio delimitado
2. **Ownership de Dados**: Apenas o sistema dono escreve em suas tabelas
3. **Anti-Acoplamento Estrutural**: Comunicação via contratos explícitos
4. **Arquitetura Evolutiva**: Preparado para extração para polirepo

## 📦 Packages

### `@japbase/ui`
Design System Japurá 2025 - Componentes React reutilizáveis

### `@japbase/contracts`
Contratos de integração entre sistemas (tipos TypeScript)

## 🔗 Links

- [Documentação Completa](./DOCUMENTACAO.md)
- [Arquitetura](./docs/arquitetura/)
- [Contratos](./docs/contratos/)
