# 📋 Documentação Técnica e Funcional - JapBase

## 🎯 Visão Estratégica

**JapBase** é a plataforma de inteligência de dados da **Japurá Pneus**, projetada para substituir planilhas manuais complexas por um ambiente seguro, auditável e de alta performance, mantendo a familiaridade visual que a diretoria exige.

**Desenvolvedora:** Maira - Inovação  
**Tecnologias:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, SheetJS (XLSX), Framer Motion

---

## ✨ Diferenciais para a Diretoria (Experiência "Excel Plus")

Para mitigar a resistência à mudança e garantir a adoção pelo CEO, implementamos funcionalidades que espelham o comportamento do Excel, mas com a robustez de um software moderno:

### 1. 📤 Exportação Nativa e Imediata
- **Segurança Psicológica:** Em qualquer tela de grid (Compras, Preços, Importação), existe um botão **"Exportar para Excel"**.
- **Funcionamento:** Transforma instantaneamente a visão atual da tela em um arquivo `.xlsx` formatado. Isso garante ao diretor que os dados "são dele" e podem ser manipulados offline se necessário.
- **Implementação:** Utiliza SheetJS (XLSX) para geração nativa de arquivos Excel.

### 2. 📊 Grids de Alta Densidade (Data Dense)
- **Visual:** Diferente de sistemas web comuns (que têm muito espaço em branco), o JapBase usa tabelas compactas, permitindo visualizar 20-30 linhas de produtos sem precisar rolar a tela, simulando a densidade de informação de uma planilha.
- **Leitura:** Linhas zebradas e alinhamento numérico à direita para facilitar a leitura rápida de valores monetários.
- **Interatividade:** Células com efeito de foco (borda azul sutil) ao passar o mouse, simulando a experiência de edição do Excel.

### 3. 🚦 Formatação Condicional Automática
- O sistema aplica cores automaticamente (sem necessidade de configuração manual pelo usuário):
  - **Vermelho:** Preço de compra acima do concorrente ou Estoque Crítico.
  - **Verde:** Oportunidade de margem ou Estoque Saudável.
  - **Amarelo:** Alertas de divergências em notas fiscais (a implementar).

### 4. 🎯 Visual "Excel-Like"
- **Ícones de Filtro:** Cada coluna possui um ícone de funil visual, indicando que filtros podem ser aplicados (preparado para implementação futura).
- **Células Focadas:** Efeito visual de célula selecionada ao passar o mouse, com borda azul e fundo azul claro.
- **Cursor de Célula:** Cursor `cell` para indicar que as células parecem editáveis.

### 5. 🎨 Visualização Híbrida (Excel vs Dashboard)
- **Alternância Dinâmica:** O usuário pode alternar entre visualização de dados puros (Grid/Excel) e análise visual (Gráficos) sem sair da tela.
- **Componente ViewToggle:** Botão segmentado elegante que permite trocar entre "Dados" e "Gráfico" instantaneamente.
- **Transições Suaves:** Animações fluidas com Framer Motion ao alternar entre visualizações.
- **Módulos Inteligentes:** Cada módulo (Compras, Importação) gerencia seu próprio estado de visualização.

---

## ✅ O Que Já Foi Implementado

### 1. **Configuração Base do Projeto**

- ✅ Estrutura de pastas `src/` configurada
- ✅ Tailwind CSS 4 configurado com cores customizadas da marca
- ✅ TypeScript configurado
- ✅ Layout base com fontes (Geist, Geist Mono, Inter)

### 2. **Sistema de Cores da Marca**

Cores customizadas no `tailwind.config.ts`:
- `jap-black` (#000000) - Fundo Sidebar
- `jap-graphite` (#3E3F40) - Fundo Cards
- `jap-silver` (#827f7f) - Bordas
- `jap-offwhite` (#f0efee) - Fundo Tela
- `jap-white` (#ffffff) - Texto

### 3. **Componentes de Layout**

#### **Sidebar.tsx** (`src/components/layout/Sidebar.tsx`)
- ✅ Barra lateral fixa com fundo preto e gradiente sutil
- ✅ Logo "JAPURÁ PNEUS" com fonte black (simulando Old Sans Black)
- ✅ **Navegação Inteligente:** Menu de navegação rápida entre módulos sem recarregar a página (Single Page Application), garantindo fluidez
- ✅ Menu de navegação com 4 opções:
  - Home (Insights e Alertas)
  - Dashboard
  - Cockpit Compras (Shopping de Preços)
  - Importação
- ✅ Item ativo com barra lateral prata animada (`#827f7f`) e fundo `#3E3F40`
- ✅ Ícones Lucide-react com `strokeWidth={1.5}` (fino e elegante)
- ✅ Animações de entrada e hover com Framer Motion
- ✅ Rodapé com "Maira - Inovação"

### 4. **Componentes do Dashboard**

#### **KPIGrid.tsx** (`src/components/dashboard/KPIGrid.tsx`)
- ✅ 3 Cards KPI minimalistas com fundo branco e borda superior grossa `#3E3F40`
- ✅ Ícones grandes e coloridos com fundos circulares:
  - Caminhão (azul) para Em Trânsito
  - Cifrão (verde) para Sugestão Compra
  - Alerta (vermelho) para Divergências
- ✅ Números grandes (`text-3xl font-black`) com tipografia tabular
- ✅ Sombra suave (`shadow-lg`)
- ✅ Animações de entrada escalonadas (Fade In + Slide Up)
- ✅ Hover effects com escala e elevação
- ⚠️ **Status:** Valores hardcoded (precisa integração com dados reais)

#### **ShoppingGrid.tsx** (`src/components/dashboard/ShoppingGrid.tsx`)
- ✅ Tabela densa estilo Excel (Data Dense)
- ✅ Colunas Estratégicas: SKU, Produto, Estoque, Trânsito (PIMP), Média Venda, Sugestão, Status, Marcar, Ação
- ✅ Cabeçalho sticky fixo no topo com fundo `#F2F2F2` (cores do Excel)
- ✅ Linhas zebradas sutis (white vs `#f9f9f9`)
- ✅ **Badges de Status:** Verde (OK), Amarelo (Alerta), Vermelho (Crítico)
- ✅ **Sistema de Marcadores:** Coluna dedicada para marcar linhas com cores (Vermelho, Verde, Amarelo)
- ✅ **Tooltip Informativo:** Mostra objetivo da marcação ao passar o mouse
- ✅ **Filtros Funcionais:** Sistema completo de filtros por coluna com busca
- ✅ **Controles de Zoom:** Aumentar/diminuir zoom de 50% a 150%
- ✅ **Dashboard de Marcadores:** Visualização agregada das marcações (gráficos e estatísticas)
- ✅ **Botão de Ação Rápida:** Aparece no hover da linha (Editar)
- ✅ Hover effect: linha destacada em azul claro (`#E7F3FF`)
- ✅ **Funcionalidade de Exportação:** Botão dedicado para baixar relatório `.xlsx`
- ✅ Visual Excel-like: Ícones de filtro e células focadas
- ✅ Números com fonte monospace para alinhamento perfeito
- ✅ Alinhamento à esquerda para todo o conteúdo
- ✅ Animações de entrada escalonadas por linha
- ✅ Contador de registros filtrados
- ⚠️ **Status:** Dados de exemplo (precisa integração com API)

#### **ShoppingModule.tsx** (`src/components/dashboard/ShoppingModule.tsx`)
- ✅ Wrapper que gerencia visualização híbrida
- ✅ Estado `viewMode` ('grid' | 'chart')
- ✅ Integra `ViewToggle` para alternância
- ✅ Renderização condicional: `ShoppingGrid` ou `TrendChart`
- ✅ Transições suaves com `AnimatePresence`

#### **ImportTracker.tsx** (`src/components/dashboard/ImportTracker.tsx`)
- ✅ Visualização de Timeline de Importação (PIMP)
- ✅ Exibição de: Número do Processo, Fornecedor, Status Visual
- ✅ Barra de progresso segmentada com 4 etapas:
  - Pedido → Embarque → Canal → Estoque
- ✅ Cores: `#827f7f` (pendente) e `#3E3F40` (concluído)
- ✅ Badge de "Previsão de Chegada"
- ✅ Design clean com bordas finas e sombra (`shadow-lg`)
- ✅ Animações de progresso escalonadas
- ✅ Hover effects com escala e elevação
- ✅ **Elimina a necessidade de entrar nos sites dos armadores** (o robô fará isso)
- ⚠️ **Status:** Dados de exemplo (precisa integração com dados reais)

#### **ImportModule.tsx** (`src/components/dashboard/ImportModule.tsx`)
- ✅ Wrapper que gerencia visualização híbrida
- ✅ Estado `viewMode` ('grid' | 'chart')
- ✅ Integra `ViewToggle` para alternância
- ✅ Renderização condicional: `ImportTracker` ou `ImportPieChart`
- ✅ Transições suaves com `AnimatePresence`

#### **PriceComparison.tsx** (`src/components/dashboard/PriceComparison.tsx`)
- ✅ Comparação "Lado a Lado": Nosso Preço vs. Concorrentes
- ✅ Colunas: Medida/SKU, Nosso Preço (Japurá), Concorrente A, Concorrente B, Diferença %
- ✅ **Lógica visual de "Semáforo" para preços:**
  - Vermelho: Preço maior que concorrente (alerta de preço alto)
  - Verde: Preço menor que concorrente (oportunidade de margem)
- ✅ Botão "Rodar Robô de Preços (IA)" com ícone
- ✅ **Funcionalidade de Exportação:** Botão para exportar comparação em Excel
- ✅ Tipografia Inter (estilo executivo)
- ✅ Números alinhados à direita
- ✅ Formatação de moeda em BRL
- ✅ Visual Excel-like: Ícones de filtro e células focadas
- ⚠️ **Status:** Dados de exemplo (precisa integração com API de preços)

### 5. **Página Principal**

#### **page.tsx** (`src/app/page.tsx`)
- ✅ Sistema de navegação por estado (`useState`)
- ✅ 4 views: `home`, `dashboard`, `import`, `pricing`
- ✅ View padrão inicial: `home` (Insights e Alertas)
- ✅ Renderização condicional dos componentes
- ✅ Layout responsivo com Sidebar fixa
- ✅ Single Page Application (SPA) - sem recarregamento de página
- ✅ Integração com módulos híbridos (`ShoppingModule`, `ImportModule`)

#### **InsightsHome.tsx** (`src/components/dashboard/InsightsHome.tsx`)
- ✅ Home Page focada em "Insights e Alertas"
- ✅ Cabeçalho "Resumo do Dia" com data atual formatada
- ✅ Seção de Alertas Críticos com destaque visual (vermelho/amarelo)
- ✅ Visão Macro com mini gráficos de progresso:
  - Vendas do Mês vs Meta
  - Importações em Trânsito vs Meta
- ✅ Atalhos Rápidos: Botões grandes para navegação rápida
- ✅ Animações de entrada escalonadas
- ✅ Cards com sombra suave e bordas arredondadas

### 6. **Componentes de Visualização Híbrida**

#### **ViewToggle.tsx** (`src/components/dashboard/ViewToggle.tsx`)
- ✅ Componente reutilizável de alternância de visualização
- ✅ Botão segmentado (Tab) com duas opções:
  - Ícone de Tabela (Grid/Excel) - "Dados"
  - Ícone de Gráfico (Dashboard) - "Gráfico"
- ✅ Estilo: Fundo `#3E3F40`, texto branco
- ✅ Indicador de seleção animado com `layoutId` (Framer Motion)
- ✅ Animações de hover e tap

#### **TrendChart.tsx** (`src/components/dashboard/TrendChart.tsx`)
- ✅ Gráfico de área (Area Chart) com SVG
- ✅ Mostra tendência de compras dos últimos 6 meses
- ✅ Linha de meta (tracejada) para comparação
- ✅ Animações de entrada para linha e área
- ✅ Legenda com cores diferenciadas
- ✅ Design premium com gradientes sutis

#### **ImportPieChart.tsx** (`src/components/dashboard/ImportPieChart.tsx`)
- ✅ Gráfico de rosca (Donut Chart) com SVG
- ✅ Distribuição de status das importações
- ✅ Legenda detalhada com valores e percentuais
- ✅ Animações de entrada escalonadas
- ✅ Cores vivas para diferenciação visual

### 7. **Utilitários**

#### **exportToExcel.ts** (`src/utils/exportToExcel.ts`)
- ✅ Função genérica para exportação de dados para Excel
- ✅ Utiliza SheetJS (XLSX) para geração nativa
- ✅ Suporta nome de arquivo e nome da planilha customizados
- ✅ Transforma arrays JSON em arquivos `.xlsx` formatados

#### **markerStorage.ts** (`src/utils/markerStorage.ts`)
- ✅ Funções para persistência de marcadores no localStorage
- ✅ `getStoredMarkers()` - Carrega marcadores salvos
- ✅ `saveMarker()` - Salva/remove marcador de um SKU
- ✅ `getAllMarkers()` - Retorna todos os marcadores
- ✅ `clearAllMarkers()` - Limpa todos os marcadores

### 8. **Sistema de Dados Centralizado**

#### **mockData.ts** (`src/data/mockData.ts`)
- ✅ Dados fictícios compartilhados para toda a plataforma
- ✅ Interfaces TypeScript para todos os tipos de dados
- ✅ `shoppingData` - 15 produtos com informações completas
- ✅ `priceComparisonData` - 12 produtos com comparação de preços
- ✅ `importProcessesData` - 6 processos de importação
- ✅ `divergenciasData` - Dados de divergências
- ✅ `getKPIData()` - Função para calcular KPIs agregados

---

## 📁 Estrutura de Arquivos

```
japbase/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout raiz com fontes (Geist, Inter)
│   │   ├── page.tsx             # Página principal com navegação SPA
│   │   └── globals.css          # Estilos globais + scrollbar customizada
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.tsx      # Barra lateral de navegação inteligente
│   │   └── dashboard/
│   │       ├── KPIGrid.tsx      # Cards de KPI com ícones coloridos
│   │       ├── InsightsHome.tsx # Home Page de Insights e Alertas
│   │       ├── ShoppingGrid.tsx # Tabela de Compras (Data Dense)
│   │       ├── ShoppingModule.tsx # Módulo híbrido de Compras
│   │       ├── TrendChart.tsx   # Gráfico de tendência (Area Chart)
│   │       ├── ImportTracker.tsx # Rastreamento de Importação (PIMP)
│   │       ├── ImportModule.tsx  # Módulo híbrido de Importação
│   │       ├── ImportPieChart.tsx # Gráfico de rosca (Donut Chart)
│   │       ├── PriceComparison.tsx # Comparativo de Mercado
│   │       ├── ViewToggle.tsx   # Componente de alternância Grid/Chart
│   │       ├── RowMarker.tsx    # Componente de marcação de linhas
│   │       ├── MarkerLegend.tsx # Legenda de marcadores
│   │       ├── MarkerDashboard.tsx # Dashboard de visualização de marcadores
│   │       └── ExcelFilter.tsx  # Componente de filtro estilo Excel
│   ├── data/
│   │   └── mockData.ts          # Dados fictícios centralizados
│   ├── utils/
│   │   ├── exportToExcel.ts     # Utilitário de exportação Excel (SheetJS)
│   │   └── markerStorage.ts     # Utilitário de persistência de marcadores
│   └── components/
│       └── ai/
│           └── JapAiAssistant.tsx # Assistente de IA (JapMind)
├── tailwind.config.ts           # Configuração do Tailwind + cores da marca
├── tsconfig.json                # Configuração TypeScript
└── package.json                 # Dependências do projeto
```

---

## 🔧 Configurações Técnicas

### Stack Tecnológica
- **Frontend:** Next.js 16 (App Router)
- **UI Framework:** React 19.2.3
- **Linguagem:** TypeScript 5.x
- **Estilização:** Tailwind CSS 4
- **Animações:** Framer Motion
- **Manipulação de Dados:** XLSX (SheetJS) para exportação Excel
- **Ícones:** Lucide React
- **Fontes:** Geist, Geist Mono, Inter (Google Fonts)
- **Tipografia Numérica:** Fonte monospace (ui-monospace) para números em tabelas

### Dependências Principais
- **next:** 16.1.2
- **react:** 19.2.3
- **react-dom:** 19.2.3
- **typescript:** 5.x
- **tailwindcss:** 4.x
- **framer-motion:** ^11.x (Animações fluidas)
- **xlsx:** 0.18.5 (SheetJS)
- **lucide-react:** 0.562.0
- **@types/xlsx:** 0.0.35

### Scripts Disponíveis
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa ESLint
```

### Especificações Técnicas Detalhadas

#### Arquitetura Frontend
- **App Router:** Next.js 16 utiliza o novo App Router para roteamento baseado em arquivos
- **Server/Client Components:** Separação estratégica entre componentes servidor e cliente
- **Type Safety:** TypeScript em todo o projeto para garantir type safety

#### Sistema de Cores da Marca
```typescript
jap-black:    #000000  // Fundo Sidebar
jap-graphite: #3E3F40  // Fundo Cards, Status Concluído
jap-silver:   #827f7f  // Bordas, Status Pendente
jap-offwhite: #f0efee  // Fundo Tela
jap-white:    #ffffff  // Texto, Fundo Cards
```

#### Funcionalidades de Exportação
- **Biblioteca:** SheetJS (XLSX) v0.18.5
- **Formato:** `.xlsx` (Excel 2007+)
- **Compatibilidade:** Total com Microsoft Excel, Google Sheets, LibreOffice
- **Performance:** Geração client-side, sem necessidade de servidor

#### Padrões de Código
- **Componentes:** Functional Components com Hooks
- **Estado Local:** `useState` para estado de componente
- **Navegação:** Estado compartilhado via props (preparado para Context API)
- **Estilização:** Utility-first com Tailwind CSS
- **Animações:** Framer Motion para transições e interações
- **Ícones:** Lucide React com `strokeWidth={1.5}` para elegância
- **Tipografia:** Inter para textos, monospace para números em tabelas

#### Recursos Visuais Premium
- **Scrollbar Customizada:** Fina e escura (`#3E3F40`) para elegância
- **Animações de Entrada:** Fade In + Slide Up para todos os componentes
- **Hover Effects:** Escala sutil e elevação em cards e botões
- **Transições:** Suaves entre visualizações (Grid ↔ Chart)
- **Indicadores Animados:** `layoutId` do Framer Motion para transições fluidas

---

## 💡 Sugestões de Melhorias

### 1. **Performance e Otimização**
- [ ] Implementar lazy loading para componentes pesados
- [ ] Adicionar memoização (React.memo, useMemo) onde necessário
- [ ] Otimizar imagens (se houver) com Next.js Image
- [ ] Implementar code splitting por rota

### 2. **UX/UI**
- [x] Adicionar animações de transição entre views (✅ Implementado com Framer Motion)
- [ ] Implementar loading states (skeletons) durante carregamento
- [ ] Adicionar feedback visual em ações (toasts/notifications)
- [ ] Melhorar responsividade mobile (Sidebar colapsável)
- [ ] Adicionar tooltips informativos nos KPIs
- [ ] Implementar dark mode (opcional)

### 3. **Funcionalidades**
- [x] Exportar dados para Excel (✅ Implementado)
- [x] Adicionar gráficos/charts nos módulos (✅ Implementado - Visualização Híbrida)
- [x] Visualização Híbrida (Grid ↔ Chart) (✅ Implementado)
- [x] Home Page de Insights e Alertas (✅ Implementado)
- [ ] Adicionar filtros e busca na tabela ShoppingGrid
- [ ] Implementar paginação nas tabelas
- [ ] Adicionar ordenação por colunas (sort)
- [ ] Implementar refresh automático de dados
- [ ] Implementar funcionalidade real dos ícones de filtro

### 4. **Acessibilidade**
- [ ] Adicionar aria-labels nos botões
- [ ] Melhorar navegação por teclado
- [ ] Adicionar contraste adequado (WCAG)
- [ ] Implementar foco visual adequado

### 5. **Código e Arquitetura**
- [ ] Criar hooks customizados (useData, usePrices, etc.)
- [ ] Implementar Context API para estado global
- [ ] Criar tipos/interfaces compartilhados em `src/types/`
- [ ] Adicionar validação de dados (Zod ou Yup)
- [ ] Implementar tratamento de erros global
- [ ] Adicionar testes unitários (Jest/Vitest)
- [ ] Adicionar testes E2E (Playwright/Cypress)

---

## 🚧 Tarefas Pendentes

### Prioridade Alta 🔴

1. **Integração com Backend/API**
   - [ ] Criar serviços de API (axios/fetch)
   - [ ] Integrar KPIGrid com dados reais
   - [ ] Integrar ShoppingGrid com dados reais
   - [ ] Integrar ImportTracker com dados reais
   - [ ] Integrar PriceComparison com dados reais
   - [ ] Implementar autenticação/autorização

2. **Gerenciamento de Estado**
   - [ ] Implementar estado global (Context API ou Zustand)
   - [ ] Adicionar cache de dados
   - [ ] Implementar sincronização em tempo real (WebSocket?)

3. **Tratamento de Erros**
   - [ ] Criar componente de Error Boundary
   - [ ] Adicionar mensagens de erro amigáveis
   - [ ] Implementar retry automático

### Prioridade Média 🟡

4. **Funcionalidades de Negócio**
   - [ ] Implementar funcionalidade do botão "Rodar Robô de Preços (IA)"
   - [ ] Adicionar detalhes expandidos nos processos PIMP
   - [ ] Criar formulário de criação de novo PIMP
   - [ ] Adicionar histórico de alterações de preços
   - [ ] Implementar alertas de divergências

5. **Dashboard Avançado**
   - [x] Adicionar gráficos de tendência (✅ Implementado - TrendChart)
   - [x] Adicionar gráficos de distribuição (✅ Implementado - ImportPieChart)
   - [ ] Criar widgets customizáveis
   - [ ] Implementar filtros por período
   - [ ] Adicionar comparação temporal

6. **Importação**
   - [ ] Adicionar upload de arquivos para importação
   - [ ] Implementar validação de dados importados
   - [ ] Criar log de importações

### Prioridade Baixa 🟢

7. **Documentação**
   - [ ] Criar Storybook para componentes
   - [ ] Documentar APIs e endpoints
   - [ ] Criar guia de contribuição

8. **DevOps**
   - [ ] Configurar CI/CD
   - [ ] Adicionar variáveis de ambiente
   - [ ] Configurar monitoramento (Sentry?)

---

## 🎨 Melhorias de Design Sugeridas

1. **Ícones e Visual**
   - Adicionar biblioteca de ícones (lucide-react já está instalada)
   - Criar ilustrações para estados vazios
   - Adicionar logos/branding da Japurá Pneus

2. **Tipografia**
   - Revisar hierarquia tipográfica
   - Adicionar variações de peso de fonte
   - Melhorar espaçamento entre elementos

3. **Cores e Temas**
   - Considerar adicionar cores de status (sucesso, erro, aviso)
   - Criar paleta de cores para gráficos
   - Adicionar gradientes sutis (opcional)

---

## 📊 Métricas e Analytics (Futuro)

- [ ] Integrar Google Analytics ou similar
- [ ] Adicionar tracking de ações do usuário
- [ ] Criar dashboard de métricas de uso
- [ ] Implementar logs de auditoria

---

## 🔐 Segurança

- [ ] Implementar autenticação (NextAuth.js ou similar)
- [ ] Adicionar autorização por roles
- [ ] Validar inputs do lado do servidor
- [ ] Implementar rate limiting
- [ ] Adicionar sanitização de dados

---

## 📝 Notas de Desenvolvimento

### Decisões Técnicas e Estratégicas
- **Navegação por estado (SPA):** Escolhido para evitar recarregamento de página e melhorar UX, garantindo fluidez similar a aplicações desktop
- **Client Components:** Usado onde necessário para interatividade (exportação, hover effects, navegação)
- **Tailwind CSS:** Escolhido para agilidade no desenvolvimento e consistência visual
- **Framer Motion:** Escolhido para animações premium e transições fluidas, elevando a percepção de qualidade
- **SheetJS (XLSX):** Escolhido para exportação nativa de Excel, garantindo compatibilidade total com planilhas
- **Visual "Excel-Like":** Implementado para reduzir curva de aprendizado e aumentar adoção pela diretoria
- **Grids Data Dense:** Priorizado para maximizar informação visível sem scroll, simulando experiência de planilha
- **Visualização Híbrida:** Permite que usuários alternem entre dados puros e análise visual sem perder contexto
- **Design Premium Executive:** Foco em fluidez, animações e contraste para criar percepção de ferramenta de alta qualidade
- **Tipografia Monospace:** Números em tabelas usam fonte monospace para alinhamento perfeito (estilo Excel)

### Próximos Passos Recomendados
1. Definir estrutura de API/Backend
2. Criar mock de dados para desenvolvimento
3. Implementar autenticação básica
4. Adicionar loading states
5. Integrar primeira API real

---

## 👥 Contato e Suporte

**Desenvolvedora:** Maira - Inovação  
**Projeto:** JapBase - Japurá Pneus

---

---

## 🆕 Funcionalidades Recentes (2025)

### Visualização Híbrida
- ✅ Alternância dinâmica entre Grid (dados puros) e Chart (análise visual)
- ✅ Componente `ViewToggle` reutilizável
- ✅ Módulos `ShoppingModule` e `ImportModule` com gerenciamento de estado
- ✅ Gráficos SVG customizados (`TrendChart`, `ImportPieChart`)

### Home Page de Insights
- ✅ Tela inicial focada em alertas críticos
- ✅ Mini gráficos de progresso (Vendas vs Meta)
- ✅ Atalhos rápidos para navegação

### Design Premium Executive
- ✅ Animações fluidas com Framer Motion
- ✅ Scrollbar customizada
- ✅ Tipografia monospace para números
- ✅ Ícones coloridos nos KPIs
- ✅ Badges de status coloridos
- ✅ Botões de ação rápida no hover

---

---

## 🆕 Funcionalidades Implementadas Recentemente

### Sistema de Marcadores com Cores (Row Markers)
- ✅ Sistema completo de marcação de linhas com cores
- ✅ Três tipos de marcadores:
  - **Vermelho:** Venda Futura - Produto destinado para venda futura
  - **Verde:** Distribuição Prevista - Carga já tem distribuição prevista
  - **Amarelo:** Alta Venda - Vamos ter muita venda deste produto
- ✅ Componente `RowMarker.tsx` com menu dropdown intuitivo
- ✅ `MarkerLegend.tsx` - Legenda interativa com contadores e filtros
- ✅ `MarkerDashboard.tsx` - Dashboard de visualização agregada:
  - Gráfico de pizza com distribuição por tipo
  - Gráfico de barras agrupado por fornecedor
  - Cards de resumo (total marcado, valor total, tipos)
- ✅ Persistência automática no localStorage
- ✅ Tooltip informativo ao passar o mouse em linhas marcadas
- ✅ Filtro por cor de marcador na legenda
- ✅ Integração completa no `ShoppingGrid`

### Melhorias no Cockpit de Compras
- ✅ Header com título e descrição
- ✅ 4 cards de resumo com estatísticas:
  - Total Estoque (unidades)
  - Sugestão Compra (quantidade e valor)
  - Alertas (críticos + alertas)
  - Média Venda (unidades/mês)
- ✅ Cálculos dinâmicos baseados em dados reais

### Melhorias na Home (InsightsHome)
- ✅ Nova seção "Próximos PIMPs" com cards de progresso
- ✅ Informações detalhadas de previsão de chegada
- ✅ Barras de progresso animadas
- ✅ Acesso Rápido melhorado com descrições e ícones

### Melhorias na Aba de PIMPs
- ✅ Header com título e descrição
- ✅ 5 cards de estatísticas agregadas:
  - Total PIMPs
  - Em Trânsito
  - Concluídos
  - Valor Total
  - Itens Total
- ✅ Cards expandíveis/retráteis no `ImportTracker`
- ✅ Status visual por processo (Concluído, Em Andamento, Iniciado)
- ✅ Barra de progresso geral com percentual
- ✅ Informações detalhadas (valor, quantidade, previsão)
- ✅ Seção expandida com detalhes de cada etapa

### Sistema de Filtros Funcionais
- ✅ Componente `ExcelFilter.tsx` reutilizável
- ✅ Filtros funcionais que filtram dados em tempo real
- ✅ Busca dentro dos filtros
- ✅ Opção "Selecionar Todos"
- ✅ Indicador visual quando há filtros ativos
- ✅ Cores do Excel (cinza claro #F2F2F2 para cabeçalho)

### Controles de Zoom
- ✅ Botões de aumentar/diminuir zoom
- ✅ Zoom de 50% a 150% (incrementos de 10%)
- ✅ Botão de reset para 100%
- ✅ Indicador visual do zoom atual
- ✅ Aplicado via CSS `zoom` para manter proporções

### Dados Fictícios Expandidos
- ✅ Arquivo `src/data/mockData.ts` centralizado
- ✅ 15 SKUs de produtos (expandido de 8)
- ✅ 12 produtos na comparação de preços (expandido de 8)
- ✅ 6 processos de importação (expandido de 4)
- ✅ Dados de divergências
- ✅ Funções de cálculo agregado (KPIs)

### IA Assistente Melhorada (JapMind)
- ✅ Responde perguntas usando dados reais da plataforma
- ✅ Reconhece padrões de perguntas:
  - Status de importação/PIMP
  - Preços e comparação (por medida/SKU)
  - Estoque e SKUs específicos
  - Divergências
  - Resumo geral (KPIs)
  - Fornecedores
  - Ajuda/comandos
- ✅ Respostas informativas com dados específicos
- ✅ Valores formatados em R$
- ✅ Percentuais e comparações

---

## 🚧 Tarefas Pendentes

### Prioridade Alta 🔴

1. **Integração com Bancos de Dados**
   - [ ] Fazer testes com os bancos de dados disponibilizados
   - [ ] Testar integrações do Supabase com o SQL Server através do n8n para trazer os dados
   - [ ] Criar serviços de API (axios/fetch)
   - [ ] Integrar KPIGrid com dados reais
   - [ ] Integrar ShoppingGrid com dados reais
   - [ ] Integrar ImportTracker com dados reais
   - [ ] Integrar PriceComparison com dados reais
   - [ ] Implementar autenticação/autorização

2. **Gerenciamento de Estado**
   - [ ] Implementar estado global (Context API ou Zustand)
   - [ ] Adicionar cache de dados
   - [ ] Implementar sincronização em tempo real (WebSocket?)

3. **Tratamento de Erros**
   - [ ] Criar componente de Error Boundary
   - [ ] Adicionar mensagens de erro amigáveis
   - [ ] Implementar retry automático

### Prioridade Média 🟡

4. **Funcionalidades de Negócio**
   - [ ] Implementar funcionalidade do botão "Rodar Robô de Preços (IA)"
   - [ ] Adicionar detalhes expandidos nos processos PIMP
   - [ ] Criar formulário de criação de novo PIMP
   - [ ] Adicionar histórico de alterações de preços
   - [ ] Implementar alertas de divergências

5. **Dashboard Avançado**
   - [x] Adicionar gráficos de tendência (✅ Implementado - TrendChart)
   - [x] Adicionar gráficos de distribuição (✅ Implementado - ImportPieChart)
   - [ ] Criar widgets customizáveis
   - [ ] Implementar filtros por período
   - [ ] Adicionar comparação temporal

6. **Importação**
   - [ ] Adicionar upload de arquivos para importação
   - [ ] Implementar validação de dados importados
   - [ ] Criar log de importações

### Prioridade Baixa 🟢

7. **Documentação**
   - [ ] Criar Storybook para componentes
   - [ ] Documentar APIs e endpoints
   - [ ] Criar guia de contribuição

8. **DevOps**
   - [ ] Configurar CI/CD
   - [ ] Adicionar variáveis de ambiente
   - [ ] Configurar monitoramento (Sentry?)

---

## 📌 Observações Importantes

### Arquitetura de Módulos
- **JapDistribution:** O módulo JapDistribution será implementado dentro do JapView, fazendo parte da estrutura modular da plataforma JapBase.

### Integração de Dados
- A plataforma está preparada para receber dados de múltiplas fontes:
  - Supabase (banco de dados PostgreSQL)
  - SQL Server (através de integração via n8n)
  - APIs REST
- O sistema de dados mock (`src/data/mockData.ts`) serve como base para desenvolvimento e será substituído por chamadas de API reais.

---

**Última atualização:** Janeiro 2025
