# Expor schema japbase no Supabase (PostgREST)

Quando usa **PostgREST** (FORCE_POSTGREST=true), o schema `japbase` precisa estar exposto na API.

## ⚡ Solução Rápida (Recomendado)

1. **Copie e cole o script completo** de `docs/configurar-schema-japbase.sql` no SQL Editor do Supabase
2. Execute o script
3. Vá em **Project Settings** → **API** → **Exposed schemas** → adicione `japbase`
4. Aguarde 1–2 minutos e teste novamente

## 📋 Passo a Passo Manual

### 1. Executar Script SQL

1. Acesse: https://supabase.com/dashboard/project/nqppjrtpwcnlufxsbknn
2. Abra o **SQL Editor** (ícone de banco de dados no menu lateral)
3. Cole o conteúdo de `docs/configurar-schema-japbase.sql`
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Verifique se apareceu "Success. No rows returned"

### 2. Expor Schema na API

1. **Project Settings** (engrenagem no canto inferior esquerdo)
2. Clique em **API** no menu lateral
3. Role até **Exposed schemas**
4. Você verá uma lista com `public` (padrão)
5. Clique em **+ Add schema** ou edite a lista
6. Adicione `japbase` (escreva exatamente assim, sem aspas)
7. Clique em **Save**

### 3. Recarregar Cache (se necessário)

Se ainda não funcionar após 1–2 minutos, execute novamente no SQL Editor:

```sql
NOTIFY pgrst, 'reload schema';
```

### 4. Verificar

1. Volte ao JapImport
2. Clique em **"Testar banco"**
3. Deve aparecer: `✅ PostgREST OK! X registro(s)...`

## 🔍 Troubleshooting

**Erro PGRST002 persiste?**
- Verifique se `japbase` está na lista de **Exposed schemas** (com vírgula: `public, japbase`)
- Execute `NOTIFY pgrst, 'reload schema';` novamente
- Aguarde até 5 minutos (cache pode demorar)

**Erro de permissão?**
- Execute o script SQL completo (`configurar-schema-japbase.sql`)
- Verifique se as tabelas existem: `SELECT * FROM japbase.pimp_pedidos_gripmaster LIMIT 1;`
