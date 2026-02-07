# JapMarket – Fluxo de Upload de Orçamentos e Planilhas de Preços

## Contexto

Quando o diretor ou equipe obtém um **orçamento de preços de concorrente** (via busca manual, cotação recebida por e-mail, PDF escaneado, planilha Excel etc.), o objetivo é inserir esses dados na **planilha de comparação de preços** do JapMarket para análise estratégica.

## Princípio Arquitetural

> **O arquivo deve subir → ser convertido para texto/estrutura → entrar no modelo padrão da planilha → o resultado aparecer no grid de comparação.**

Ou seja: **não importamos o arquivo bruto**. Sempre há uma etapa de **normalização** para o schema padrão do JapMarket.

---

## Fluxo Planejado (Meio Caminho Andado)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│  Upload do      │     │  Conversão para   │     │  Mapeamento para     │     │  Inserção no     │
│  arquivo        │ ──► │  texto/estrutura  │ ──► │  modelo padrão       │ ──► │  grid de         │
│  (Excel/PDF)    │     │  intermediária    │     │  da planilha         │     │  comparação      │
└─────────────────┘     └──────────────────┘     └─────────────────────┘     └──────────────────┘
```

### Etapa 1: Upload do arquivo
- Usuário seleciona arquivo (Excel, PDF, CSV).
- Informa: quem fez o upload (manual) ou marca como automático.
- Arquivo enviado para API `/api/japmarket/upload`.

### Etapa 2: Conversão para texto/estrutura intermediária
- **Excel/CSV**: Parse direto via biblioteca (xlsx, sheetjs) → extração de linhas e colunas.
- **PDF**: 
  - **Opção A (OCR)**: Extrair texto via OCR (Tesseract.js, pdf-parse, ou serviço cloud).
  - **Opção B (IA)**: Enviar PDF para modelo de IA (OpenAI Vision, Anthropic, etc.) que retorna texto estruturado ou JSON com preços, pneus, loja, responsável.
  - **Opção C (híbrido)**: OCR para PDFs escaneados + IA para interpretação e extração de campos.
- Saída: estrutura intermediária (ex.: `{ produto, medida, preco, loja, ... }[]`).

### Etapa 3: Mapeamento para modelo padrão da planilha
- O **modelo padrão** do JapMarket é definido em `src/services/japmarket/types.ts`:
  - `produto`, `medida`, `marca`, `modelo`, `loja`, `estado`
  - `nossoPreco`, `concorrente1/2/3` (nome + preço)
  - `economia`, `variacao`, `dataAnalise`, `fonte`, `tipoOrigem`, `responsavel`
- Regras de mapeamento:
  - Colunas com nomes variados (ex.: "Pneu", "Descrição", "Item") → `produto`
  - "Medida", "Dimensão", "205/55R16" → `medida`
  - "Loja", "Filial", "Unidade" → `loja`
  - Preços em formatos diversos (R$ 1.234,56 / 1234.56) → normalização numérica
- IA pode auxiliar na **inferência** quando colunas forem ambíguas ou PDF não tiver estrutura clara.

### Etapa 4: Inserção no grid de comparação
- Registros mapeados são inseridos no estado do JapMarket (e, futuramente, no banco Supabase).
- Cada registro recebe `fonte` explícita: ex. "Upload manual por João Silva" ou "Inserção automática em 2025-01-23".
- O resultado aparece imediatamente no grid, com possibilidade de filtros, cores e exportação.

---

## Opções Técnicas a Estudar

| Etapa | Tecnologia | Prós | Contras |
|-------|------------|------|---------|
| PDF → texto | **pdf-parse** | Simples, Node.js | Limitado em PDFs complexos |
| PDF → texto | **Tesseract.js** | OCR local, gratuito | Requer imagem; qualidade variável |
| PDF → texto | **OpenAI Vision / Anthropic** | Alta precisão, entende layout | Custo, latência, dependência externa |
| PDF → texto | **Google Document AI** | Especializado em documentos | Custo, integração |
| Mapeamento | **Regras + heurísticas** | Determinístico, barato | Menos flexível |
| Mapeamento | **IA (LLM)** | Adapta a formatos variados | Custo, necessidade de validação |

---

## Implementação Atual (Estado Atual)

- **Excel/CSV**: ✅ Implementado. Parse via `xlsx`, mapeamento de colunas por nome, inserção no grid.
- **PDF**: ⏳ Placeholder. Retorna mensagem informando que integração com IA/OCR está em desenvolvimento.
- **Modelo padrão**: ✅ Definido em `types.ts`.
- **Fonte**: ✅ Campo `fonte` e `tipoOrigem` preenchidos conforme upload manual ou automático.

---

## Próximos Passos Recomendados

1. **Definir prioridade**: PDF é crítico? Se sim, avaliar custo vs. benefício de IA vs. OCR.
2. **Protótipo PDF**: Testar `pdf-parse` + regex para PDFs simples; ou envio para OpenAI Vision com prompt estruturado.
3. **Validação**: Sempre permitir que o usuário revise/edite os dados antes de confirmar a inserção em lote.
4. **Persistência**: Migrar de `localStorage` para Supabase (`market.comparacoes_preco`) quando o schema estiver definido.
