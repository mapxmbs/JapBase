# Design System - JapBase

**Princípio central:** "Se o usuário não perceber que saiu do Excel, o design está correto."

Sistema exclusivo para diretoria da Japurá Pneus. Usuários avessos a interfaces "modernas demais". Objetivo: familiar, denso, previsível, extremamente funcional.

---

## Paleta Institucional (exclusiva)

| Cor | Hex | Uso |
|-----|-----|-----|
| **japura-bg** | `#f0efee` | Fundo principal |
| **japura-black** | `#000000` | Títulos, destaque, sidebar |
| **japura-dark** | `#3E3F40` | Textos secundários, botões |
| **japura-grey** | `#827f7f` | Labels, auxiliares |
| **japura-white** | `#ffffff` | Fundo de tabelas, modais |

**Não usar:** cores "moderninhas", gradientes, efeitos decorativos. Apenas a paleta acima.

---

## Tipografia

- **Fonte:** Inter
- **Título principal:** `text-lg font-semibold` (18px)
- **Seções:** `text-sm font-semibold` ou `text-base`
- **Evitar:** `font-black` excessivo
- **Priorizar:** legibilidade e escaneabilidade

---

## Espaçamento (~50% reduzido)

| Elemento | Classe | Valor |
|----------|--------|-------|
| Padding geral | `p-2` ou `p-3` | 8px / 12px |
| Grid gaps | `gap-2` | 8px |
| Espaçamento vertical | `space-y-2` | 8px |
| Evitar | `p-6`, `gap-6` | Grandes áreas vazias |

---

## Bordas e Sombras

- **Border radius:** máximo 4px–6px (`rounded`)
- **Evitar:** `rounded-lg`, `rounded-xl`
- **Sombras:** apenas hover, foco ou elementos flutuantes
- **Não usar:** shadow como decoração

---

## Tabelas (foco principal)

- Header fixo, `bg-gray-200`, `border-b border-gray-400`
- Linhas bem delimitadas, `border-r border-gray-300/400`
- Zebra sutil: `bg-white` / `bg-gray-50/80`
- Hover discreto: `hover:bg-japura-bg`
- Layout denso: `px-2 py-1` nas células
- `text-xs` para conteúdo

---

## Componentes

### Botões
- Retangulares, simples
- `px-2 py-1` ou `px-3 py-1.5`
- `border border-gray-400`
- `rounded` (4px)
- `text-xs` ou `text-sm`

### Ícones
- Tamanho: 12px–16px (`size={12}` ou `size={14}`)
- Funcionais, não decorativos

### Inputs
- `border border-gray-400`
- `rounded`
- `focus:ring-1 focus:ring-japura-dark`
- Alinhados em grid

---

## Tom Visual

- Corporativo
- Industrial
- Sério
- Funcional
- Nada "cool"
- Nada "startup"

---

## Padrões Aplicados

| Componente | Antes | Depois |
|------------|-------|--------|
| Page padding | `p-8` | `p-3` |
| Border radius | `rounded-japura` (12px) | `rounded` (4px) |
| Sidebar width | 280px | 220px |
| Títulos | `text-2xl font-black` | `text-lg font-semibold` |
| Cards KPI | Cards grandes | Linha compacta inline |
| Tabelas | `px-4 py-3` | `px-2 py-1` |
| Botões | `rounded-lg` | `rounded` |
| Sombras | `shadow-sm` decorativo | Apenas hover quando necessário |

---

## Módulos Principais

### JapPricing (Unificado)
Módulo central de preços: Formação, Shopping (mercado), Auditoria, Parâmetros, Histórico. Ver `docs/JAPPRICING.md` para arquitetura e fluxo.
