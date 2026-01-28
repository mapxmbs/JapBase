# Script para fazer commit e push das alterações
# Execute este script quando o lock do Git for liberado

Write-Host "Adicionando todas as alterações..." -ForegroundColor Cyan
git add -A

Write-Host "`nVerificando status..." -ForegroundColor Cyan
git status --short

Write-Host "`nFazendo commit..." -ForegroundColor Cyan
git commit -m "feat: Reorganização para Monorepo Polissistêmico Evolutivo

- Implementada estrutura de Monorepo orientado a Polissistemas
- Criados apps/ como mapa arquitetural (japbase-hub, japimport, japview, japmarket, etc.)
- Criados packages/ compartilhados (ui, contracts)
- Criado docs/ para documentação
- Refatorado pimpsService.ts para trabalhar diretamente com schema japbase
- Implementado retry automático para erros PGRST002 (instabilidade Supabase)
- Adicionadas abas Gripmaster, Trânsito e Recebidos no JapImport
- Melhorado diagnóstico de conexão com Supabase
- Atualizada documentação completa (DOCUMENTACAO.md)
- Removidos componentes antigos não utilizados
- Preparação para futura extração para polirepo sem retrabalho"

Write-Host "`nFazendo push para origin/main..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Concluído!" -ForegroundColor Green
