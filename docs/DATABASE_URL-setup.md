# Como Configurar DATABASE_URL

## O que é DATABASE_URL?

A `DATABASE_URL` é a **connection string direta do PostgreSQL**, diferente da URL do projeto Supabase (`NEXT_PUBLIC_SUPABASE_URL`).

## Como Obter (no Dashboard)

1. Acesse: https://supabase.com/dashboard/project/nqppjrtpwcnlufxsbknn
2. No menu lateral esquerdo, clique em **Project Settings** (ícone de engrenagem)
3. No submenu, clique em **Database**
4. Role a página até a seção **Connection string**
5. Selecione a aba **URI** (não "JDBC" nem "DotNet")
6. Escolha **Session mode** (porta 5432) ou **Transaction mode** (porta 6543)
7. Clique em **Copy** para copiar a string completa

**Alternativa:** Se não encontrar, use o formato direto:
`postgresql://postgres:[SENHA]@db.nqppjrtpwcnlufxsbknn.supabase.co:5432/postgres`
(Substitua [SENHA] pela senha do banco; se tiver `@`, use `%40` no lugar)

## Formato Esperado

```
postgresql://postgres.nqppjrtpwcnlufxsbknn:[SENHA-DO-BANCO]@aws-0-[region].pooler.supabase.com:5432/postgres
```

**IMPORTANTE**: Substitua `[SENHA-DO-BANCO]` pela senha que você configurou quando criou o projeto Supabase.

Se você não lembra da senha:
- Vá em **Project Settings** → **Database** → **Database password**
- Você pode resetar a senha se necessário

## Adicionar no .env.local

Cole a connection string completa no `.env.local`:

```
DATABASE_URL=postgresql://postgres.nqppjrtpwcnlufxsbknn:SUA_SENHA_AQUI@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**Nota**: A região (`us-east-1`) pode variar - use a que aparecer no seu dashboard.
