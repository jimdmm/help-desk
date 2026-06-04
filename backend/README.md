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
- [Fluxo de status dos chamados](#fluxo-de-status-dos-chamados)
- [Scripts disponíveis](#scripts-disponíveis)

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Runtime | Node.js 20+ |
| Framework | NestJS 11 |
| Linguagem | TypeScript 5 (`strict: true`) |
| Banco de dados | PostgreSQL 16 via Prisma 7 |
| Cache | Redis 7 (ioredis) |
| Autenticação | JWT RS256 (passport-jwt) |
| Hash de senhas | bcryptjs |
| Validação | Zod 4 |
| Testes unitários | Vitest + repositórios in-memory |
| Testes E2E | Vitest + Supertest + TestContainers |
| Armazenamento | Supabase Storage |
| Containerização | Docker + Docker Compose |

---

## Arquitetura

O projeto segue a **Arquitetura Hexagonal (Ports & Adapters)**:

```
src/
├── domain/                 # Entidades, value objects, ports (interfaces)
│   ├── entities/           # Admin, Client, Technician, Service, Ticket, TicketServices
│   ├── ports/              # Contratos dos repositórios
│   └── value-objects/      # Money, TicketStatus, Availability
│
├── application/            # Use cases, DTOs, erros de aplicação
│   ├── cryptography/       # Abstrações de hash e JWT
│   ├── dtos/               # Contratos de entrada/saída dos use cases
│   ├── errors/             # Erros de domínio/aplicação
│   ├── storage/            # Abstração de upload
│   └── use-cases/          # Lógica de negócio (22 use cases)
│
├── infra/                  # Implementações concretas
│   ├── auth/               # Guards JWT, decorators, RBAC
│   ├── cache/              # Redis (ioredis)
│   ├── cryptography/       # BcryptHasher + JwtEncrypter
│   ├── database/           # PrismaService, mappers, repositories
│   ├── env/                # Validação de env com Zod
│   ├── http/               # ZodValidationPipe, HttpModule
│   └── storage/            # Supabase Storage
│
└── presentation/
    └── controllers/        # 23 controllers HTTP
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
```

> O `.env.example` já tem as chaves JWT de desenvolvimento geradas. Basta ajustar as variáveis do Supabase para habilitar o upload de imagens.

### 4. Suba os serviços com Docker

```bash
docker compose up -d
```

Isso inicia:
- **PostgreSQL 16** na porta `5432`
- **Redis 7** na porta `6379`

### 5. Execute as migrations

```bash
pnpm db:migrate
```

### 6. Execute o seed

```bash
pnpm db:seed
```

Cria os dados iniciais:

| Role | Email | Senha |
|------|-------|-------|
| Admin | `admin@helpdesk.com` | `admin123` |
| Técnico | `carlos@helpdesk.com` | `tecnico123` |
| Técnico | `ana@helpdesk.com` | `tecnico123` |
| Técnico | `rafael@helpdesk.com` | `tecnico123` |

Além de **6 serviços** pré-cadastrados (Formatação, Limpeza, SSD, Vírus, Rede, Tela).

### 7. Inicie o servidor

```bash
pnpm start:dev
```

A API estará disponível em `http://localhost:3333`.

---

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
|----------|-------------|--------|-----------|
| `PORT` | Não | `3333` | Porta do servidor |
| `DATABASE_URL` | Sim | — | URL de conexão PostgreSQL |
| `JWT_PRIVATE_KEY` | Sim | — | Chave privada RSA 2048 em base64 |
| `JWT_PUBLIC_KEY` | Sim | — | Chave pública RSA 2048 em base64 |
| `REDIS_HOST` | Não | `localhost` | Host do Redis |
| `REDIS_PORT` | Não | `6379` | Porta do Redis |
| `REDIS_DB` | Não | `0` | Database do Redis |
| `SUPABASE_URL` | Sim | — | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | — | Service role key do Supabase |
| `SUPABASE_STORAGE_BUCKET` | Sim | — | Nome do bucket de armazenamento |

### Gerando as chaves JWT

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem

base64 -w 0 private.pem   # → JWT_PRIVATE_KEY
base64 -w 0 public.pem    # → JWT_PUBLIC_KEY
```

---

## Rotas da API

Todas as rotas (exceto **PUBLIC**) exigem:
```
Authorization: Bearer <access_token>
```

Respostas de listagem incluem paginação:
```json
{
  "meta": { "total": 50, "page": 1, "limit": 20, "totalPages": 3 }
}
```

**Query params de paginação** (opcionais, padrão `page=1&limit=20`, máx `limit=100`):
```
GET /clients?page=2&limit=10
```

---

### Autenticação

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/sessions` | PUBLIC | Login — retorna `access_token` JWT |

**Body:**
```json
{ "email": "string", "password": "string (min 6)" }
```

**Response `200`:**
```json
{ "access_token": "<jwt>" }
```

---

### Clientes

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/clients` | PUBLIC | Criar conta de cliente |
| `GET` | `/clients` | ADMIN | Listar todos os clientes (paginado) |
| `PUT` | `/clients/:id` | ADMIN / próprio CLIENT | Editar nome ou email |
| `DELETE` | `/clients/:id` | ADMIN / próprio CLIENT | Excluir conta (cascata nos chamados) |
| `POST` | `/clients/:id/profile-image` | ADMIN / próprio CLIENT | Upload de foto de perfil |

**Body `POST /clients`:**
```json
{ "name": "string (min 2)", "email": "email", "password": "string (min 6)" }
```

---

### Técnicos

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/technicians` | ADMIN | Criar técnico |
| `GET` | `/technicians` | Autenticado | Listar técnicos (paginado) |
| `PUT` | `/technicians/:id` | ADMIN / próprio TECHNICIAN | Editar nome, email ou disponibilidade |
| `DELETE` | `/technicians/:id` | ADMIN | Excluir técnico |
| `POST` | `/technicians/:id/profile-image` | ADMIN / próprio TECHNICIAN | Upload de foto de perfil |

**Body `POST /technicians`:**
```json
{
  "name": "string",
  "email": "email",
  "password": "string (min 6)",
  "availability": ["08:00", "09:00", "..."]
}
```

> Se `availability` for omitida, aplica o padrão: `['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']`

---

### Serviços

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/services` | ADMIN | Criar serviço |
| `GET` | `/services` | Autenticado | Listar serviços (paginado, cache Redis 60s) |
| `PUT` | `/services/:id` | ADMIN | Editar nome ou preço |
| `PATCH` | `/services/:id/deactivate` | ADMIN | Desativar serviço |

**Body `POST /services`:**
```json
{ "name": "string (min 2)", "price": "number (positivo)" }
```

> Serviços desativados não aparecem na listagem de criação de chamados. O preço é salvo como **snapshot** no momento da vinculação ao chamado.

---

### Chamados (Tickets)

| Método | Rota | Role | Descrição |
|--------|------|------|-----------|
| `POST` | `/tickets` | CLIENT | Criar chamado |
| `GET` | `/tickets` | ADMIN | Listar todos os chamados (paginado) |
| `GET` | `/tickets/me` | CLIENT | Listar chamados do cliente logado (paginado) |
| `GET` | `/tickets/assigned` | TECHNICIAN | Listar chamados do técnico logado (paginado) |
| `PATCH` | `/tickets/:id/start` | TECHNICIAN | Iniciar atendimento (`OPEN → IN_PROGRESS`) |
| `PATCH` | `/tickets/:id/close` | TECHNICIAN | Encerrar chamado (`IN_PROGRESS → CLOSED`) |
| `POST` | `/tickets/:id/services` | TECHNICIAN | Adicionar serviço ao chamado |

**Body `POST /tickets`:**
```json
{
  "technicianId": "uuid",
  "title": "string (min 3)",
  "description": "string (min 10)",
  "serviceIds": ["uuid"]
}
```

**Body `POST /tickets/:id/services`:**
```json
{ "serviceId": "uuid" }
```

---

## Testes

### Testes unitários

Cobrem todos os 22 use cases com repositórios em memória (sem banco de dados real).

```bash
pnpm test:unit          # executa uma vez
pnpm test:unit:watch    # modo watch
pnpm test:unit:cov      # com relatório de cobertura (HTML + lcov)
```

### Testes E2E

Usam **TestContainers** para subir instâncias reais de PostgreSQL e Redis via Docker automaticamente. Cobrem os caminhos felizes de todos os endpoints.

```bash
pnpm run test:E2E        # executa uma vez
pnpm run test:E2E:watch  # modo watch
```

> **Requisito:** Docker deve estar em execução na máquina. Os containers são criados e destruídos automaticamente a cada execução.

**O que os testes E2E validam:**

| Arquivo | Testes |
|---------|--------|
| `auth.e2e-spec.ts` | Login de client, technician e admin |
| `clients.e2e-spec.ts` | CRUD completo de clientes + paginação |
| `technicians.e2e-spec.ts` | CRUD completo de técnicos |
| `services.e2e-spec.ts` | CRUD + desativação de serviços |
| `tickets.e2e-spec.ts` | Criação, listagem e ciclo de vida completo (OPEN → IN_PROGRESS → CLOSED) |

---

## Fluxo de status dos chamados

```
OPEN  ──►  IN_PROGRESS  ──►  CLOSED
```

- Transições reversas não são permitidas
- Somente o técnico responsável pode mudar o status
- Todo chamado deve ter **pelo menos 1 serviço** no momento da criação

---

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm start:dev` | Inicia em modo desenvolvimento com hot-reload |
| `pnpm start:prod` | Inicia a versão compilada |
| `pnpm build` | Compila o projeto |
| `pnpm db:migrate` | Cria/atualiza o schema via Prisma migrations |
| `pnpm db:seed` | Popula o banco com admin, técnicos e serviços iniciais |
| `pnpm test:unit` | Executa testes unitários (60 testes) |
| `pnpm test:unit:cov` | Testes unitários com relatório de cobertura |
| `pnpm run test:E2E` | Executa testes E2E com TestContainers (requer Docker) |
| `pnpm check` | Formata e verifica o código com Biome |
