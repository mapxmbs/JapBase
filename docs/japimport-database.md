# JapImport – Configuração de Banco de Dados

## Problema: PGRST002 (Schema Cache)

O erro `Could not query the database for the schema cache. Retrying. (PGRST002)` ocorre quando o PostgREST do Supabase não consegue construir o cache de schema. Isso **não é instabilidade** – é uma limitação conhecida do PostgREST.

## Solução: Conexão Direta PostgreSQL

O JapImport usa **conexão direta ao PostgreSQL**, contornando completamente o PostgREST.

### 1. Obter a Connection String

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Project Settings** → **Database**
4. Em **Connection string**, selecione **URI**
5. Copie a connection string (modo **Session** ou **Transaction**)
6. Substitua `[YOUR-PASSWORD]` pela senha do banco (a mesma que você usa no SQL Editor)

### 2. Configurar no .env.local

Adicione no `.env.local`:

```
DATABASE_URL=postgresql://postgres.[ref]:[SENHA]@aws-0-[region].pooler.supabase.com:5432/postgres
```

Exemplo (com dados fictícios):
```
DATABASE_URL=postgresql://postgres.abcdefgh:MinhaSenha123@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### 3. Reiniciar o servidor

Após configurar, reinicie o Next.js com `npm run dev`.

## Estrutura do Backend (Monorepo Polissistêmico)

```
src/
├── lib/db/                    # Camada de acesso a dados
│   ├── postgres.ts            # Conexão direta PostgreSQL
│   └── supabase.ts            # Cliente Supabase (fallback)
│
├── services/japimport/        # Bounded Context JapImport
│   ├── types.ts               # Tipos do domínio
│   ├── pimpsRepository.ts     # Acesso a japbase.*
│   └── index.ts
│
├── app/api/japimport/         # API REST do JapImport
│   ├── pimps/
│   ├── produtos/
│   ├── transito/
│   ├── recebidos/
│   ├── counts/
│   ├── test/
│   └── debug/
│
└── lib/japimportApi.ts        # Cliente de API (frontend)
```

## Endpoints de Diagnóstico

- **GET /api/japimport/test** – Testa conexão com o banco
- **GET /api/japimport/debug** – Retorna amostra de dados e status
