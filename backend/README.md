# Help Desk API

API REST para gerenciamento de chamados técnicos, construída com NestJS, Prisma e PostgreSQL seguindo arquitetura hexagonal.

## Sumário

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Executando localmente](#executando-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rotas da API](#rotas-da-api)
- [Testes](#testes)

---

## Tecnologias

- **Runtime:** Node.js 20+
- **Framework:** NestJS 11
- **Banco de dados:** PostgreSQL 16 (via Prisma 7)
- **Cache:** Redis 7 (ioredis)
- **Autenticação:** JWT RS256 (passport-jwt)
- **Hash de senhas:** bcryptjs
- **Validação:** Zod
- **Testes:** Vitest
- **Armazenamento de arquivos:** Supabase Storage

---

## Arquitetura

O projeto segue a **Arquitetura Hexagonal (Ports & Adapters)**:

```
src/
├── domain/           # Entidades, value objects, ports (interfaces)
├── application/      # Use cases, DTOs, erros de aplicação
├── infra/            # Implementações concretas (Prisma, JWT, Redis, Supabase)
│   ├── auth/         # Guards, estratégia JWT, decorators
│   ├── cache/        # Redis cache
│   ├── cryptography/ # Bcrypt + JWT encrypter
│   ├── database/     # Prisma service, mappers, repositories
│   ├── env/          # Validação de variáveis de ambiente
│   ├── http/         # Módulo HTTP, ZodValidationPipe
│   └── storage/      # Supabase Storage
└── presentation/
    └── controllers/  # Controllers HTTP
```

---

## Pré-requisitos

- Node.js 20+
- pnpm 10+
- Docker e Docker Compose

---

## Executando localmente

### 1. Clone o repositório

```bash
git clone <repo-url>
cd help-desk/backend
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 4. Suba os serviços com Docker

```bash
docker compose up -d
```

### 5. Execute as migrations

```bash
pnpm db:migrate
```

### 6. Execute o seed

```bash
pnpm db:seed
```

Isso cria:
- 1 conta de Admin: `admin@helpdesk.com` / `admin123`
- 3 Técnicos: `carlos@helpdesk.com`, `ana@helpdesk.com`, `rafael@helpdesk.com` (senha: `tecnico123`)
- 6 Serviços pré-cadastrados

### 7. Inicie o servidor

```bash
pnpm start:dev
```

A API estará disponível em `http://localhost:3333`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do `backend/` com as seguintes variáveis:

```env
PORT=3333

# Banco de dados
DATABASE_URL="postgresql://docker:docker@localhost:5432/helpdesk?schema=public"

# JWT — gere um par de chaves RS256 e codifique em base64
JWT_PRIVATE_KEY="<base64_da_chave_privada>"
JWT_PUBLIC_KEY="<base64_da_chave_publica>"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Supabase Storage
SUPABASE_URL="https://<projeto>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service_role_key>"
SUPABASE_STORAGE_BUCKET="<nome_do_bucket>"
```

### Gerando as chaves JWT

```bash
# Gera par de chaves RS256
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem

# Codifica em base64
base64 -w 0 private.pem   # → JWT_PRIVATE_KEY
base64 -w 0 public.pem    # → JWT_PUBLIC_KEY
```

---

## Rotas da API

Todas as rotas (exceto as marcadas como **PUBLIC**) exigem o header:
```
Authorization: Bearer <access_token>
```

As respostas paginadas incluem um campo `meta`:
```json
{
  "meta": { "total": 50, "page": 1, "limit": 20, "totalPages": 3 }
}
```

### Autenticação

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/sessions` | PUBLIC | Login (client, technician ou admin) |

**Body:**
```json
{ "email": "string", "password": "string" }
```

---

### Clientes

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/clients` | PUBLIC | Criar conta de cliente |
| `GET` | `/clients?page=1&limit=20` | ADMIN | Listar todos os clientes |
| `PUT` | `/clients/:id` | ADMIN / próprio CLIENT | Editar cliente |
| `DELETE` | `/clients/:id` | ADMIN / próprio CLIENT | Excluir cliente |
| `POST` | `/clients/:id/profile-image` | ADMIN / próprio CLIENT | Upload de foto de perfil |

---

### Técnicos

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/technicians` | ADMIN | Criar técnico |
| `GET` | `/technicians?page=1&limit=20` | Autenticado | Listar técnicos |
| `PUT` | `/technicians/:id` | ADMIN / próprio TECHNICIAN | Editar técnico |
| `DELETE` | `/technicians/:id` | ADMIN | Excluir técnico |
| `POST` | `/technicians/:id/profile-image` | ADMIN / próprio TECHNICIAN | Upload de foto de perfil |

---

### Serviços

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/services` | ADMIN | Criar serviço |
| `GET` | `/services?page=1&limit=20` | Autenticado | Listar serviços (cache Redis 60s) |
| `PUT` | `/services/:id` | ADMIN | Editar serviço |
| `PATCH` | `/services/:id/deactivate` | ADMIN | Desativar serviço |

---

### Chamados (Tickets)

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/tickets` | CLIENT | Criar chamado |
| `GET` | `/tickets?page=1&limit=20` | ADMIN | Listar todos os chamados |
| `GET` | `/tickets/me?page=1&limit=20` | CLIENT | Listar chamados do cliente logado |
| `GET` | `/tickets/assigned?page=1&limit=20` | TECHNICIAN | Listar chamados do técnico logado |
| `PATCH` | `/tickets/:id/start` | TECHNICIAN | Iniciar atendimento (`OPEN → IN_PROGRESS`) |
| `PATCH` | `/tickets/:id/close` | TECHNICIAN | Encerrar chamado (`IN_PROGRESS → CLOSED`) |
| `POST` | `/tickets/:id/services` | TECHNICIAN | Adicionar serviço ao chamado |

---

## Testes

```bash
# Executa testes unitários
pnpm test:unit

# Executa com watch mode
pnpm test:unit:watch

# Gera relatório de cobertura
pnpm test:unit:cov
```

Os testes cobrem todos os use cases com repositórios em memória.

---

## Fluxo de status dos chamados

```
OPEN → IN_PROGRESS → CLOSED
```

Transições reversas não são permitidas.

---

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm start:dev` | Inicia em modo desenvolvimento com hot-reload |
| `pnpm build` | Compila o projeto |
| `pnpm start:prod` | Inicia a versão compilada |
| `pnpm db:migrate` | Executa migrations do Prisma |
| `pnpm db:seed` | Popula o banco com dados iniciais |
| `pnpm test:unit` | Executa testes unitários |
| `pnpm test:unit:cov` | Executa testes com cobertura |
