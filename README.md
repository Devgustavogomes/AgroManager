# 🌱 AgroManager

**Plataforma de gestão agrícola** para produtores rurais gerenciarem suas propriedades, culturas e safras de forma organizada e eficiente.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Monorepo](#-arquitetura-do-monorepo)
- [Tech Stack](#-tech-stack)
- [API — Decisões Arquiteturais](#-api--decisões-arquiteturais)
  - [DDD e Clean Architecture](#ddd-e-clean-architecture)
  - [Sistema de Autenticação (JWT + Redis Sessions)](#sistema-de-autenticação-jwt--redis-sessions)
  - [Sistema de Autorização (Guards)](#sistema-de-autorização-guards)
  - [Validação com Zod](#validação-com-zod)
  - [Transações e Locks (PostgreSQL)](#transações-e-locks-postgresql)
  - [Value Objects](#value-objects)
  - [Mappers e Separação de Camadas](#mappers-e-separação-de-camadas)
- [Infraestrutura e DevOps](#-infraestrutura-e-devops)
  - [Docker e Nginx](#docker-e-nginx)
  - [CI/CD — GitHub Actions](#cicd--github-actions)
  - [Qualidade de Código](#qualidade-de-código)
- [Módulos da API](#-módulos-da-api)
- [Modelo de Dados](#-modelo-de-dados)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

## 🔭 Visão Geral

O AgroManager é uma plataforma completa para gestão agrícola, projetada para permitir que produtores rurais:

- **Cadastrem e gerenciem propriedades** com controle rigoroso de áreas (total, arável e vegetação)
- **Organizem culturas** dentro de suas propriedades com alocação inteligente de área
- **Acompanhem safras (crops)** com status de plantio, colheita esperada e pragas
- **Controlem acesso** através de autenticação segura com tokens JWT e sessões revogáveis via Redis

O projeto é estruturado como um **monorepo** que abriga três aplicações independentes:

| Workspace | Descrição | Status |
|-----------|-----------|--------|
| `api/` | API REST construída com NestJS | 🟢 Em desenvolvimento avançado |
| `web/` | Frontend web com Next.js | 🔴 Não iniciado |
| `workers/` | Workers para processamento assíncrono | 🔴 Não iniciado |

---

## 🏗 Arquitetura do Monorepo

```
AgroManager/
├── api/                          # API REST (NestJS)
│   ├── src/
│   │   ├── config/               # Configurações e validação de env
│   │   ├── infra/                # Infraestrutura (DB, Redis, Migrations)
│   │   ├── modules/              # Módulos de domínio
│   │   │   ├── auth/             # Autenticação (JWT + Redis)
│   │   │   ├── producer/         # Produtores (DDD completo)
│   │   │   ├── property/         # Propriedades (DDD completo)
│   │   │   ├── culture/          # Culturas (DDD completo)
│   │   │   └── crops/            # Safras
│   │   └── shared/               # Código compartilhado
│   │       ├── decorators/       # Decoradores customizados
│   │       ├── domain/           # Entidades base e Value Objects
│   │       ├── guards/           # Guards de autenticação e autorização
│   │       └── types/            # Tipos compartilhados
│   ├── Dockerfile                # Container de desenvolvimento
│   └── prod.Dockerfile           # Multi-stage build para produção
│
├── web/                          # Frontend (Next.js) — 🔴 Não iniciado
├── workers/                      # Workers (NestJS) — 🔴 Não iniciado
│
├── migrations/                   # Migrations SQL do banco de dados
├── docker-compose.yml            # Orquestração local (API + Postgres + Redis + Nginx)
├── nginx.conf                    # Reverse proxy para a API
└── .github/
    ├── workflows/                # CI/CD pipelines por workspace
    └── dependabot.yml            # Atualização automática de dependências
```

O monorepo utiliza **NPM Workspaces** para gerenciar dependências de forma centralizada, com um único `package-lock.json` na raiz, garantindo consistência de versões entre todos os subprojetos.

---

## 🧰 Tech Stack

| Camada | Tecnologia | Finalidade |
|--------|-----------|------------|
| **Runtime** | Node.js 26 | Ambiente de execução |
| **Framework** | NestJS 11 | Framework de API com IoC e decoradores |
| **Linguagem** | TypeScript 5 | Tipagem estática |
| **Banco de Dados** | PostgreSQL 16 | Persistência relacional |
| **Cache / Sessões** | Redis 8 | Armazenamento de refresh tokens e sessões |
| **Validação** | Zod 4 + nestjs-zod | Validação de schemas com inferência de tipos |
| **Autenticação** | JWT (@nestjs/jwt) + bcryptjs | Tokens de acesso e hash de senhas |
| **Documentação** | Swagger (@nestjs/swagger) | Documentação interativa da API |
| **Testes** | Vitest + SWC | Testes unitários com performance otimizada |
| **Container** | Docker + Docker Compose | Containerização e orquestração local |
| **Reverse Proxy** | Nginx | Proxy reverso para a API |
| **CI/CD** | GitHub Actions | Build, lint, testes e deploy automatizados |
| **Qualidade** | ESLint + Prettier + Commitlint + Husky | Padronização de código e commits |

---

## 🧠 API — Decisões Arquiteturais

### DDD e Clean Architecture

A API segue os princípios de **Domain-Driven Design** e **Clean Architecture**, organizando cada módulo de domínio em quatro camadas bem definidas:

```
modules/producer/
├── domain/                       # Camada de Domínio (core)
│   ├── entities/                 # Entidades de domínio com regras de negócio
│   └── repositories/             # Contratos (interfaces) de persistência
│
├── application/                  # Camada de Aplicação
│   ├── use-cases/                # Casos de uso (orquestração de regras)
│   └── dtos/                     # Data Transfer Objects (entrada/saída)
│
├── infrastructure/               # Camada de Infraestrutura
│   └── persistence/              # Implementação concreta dos repositórios
│
└── presentation/                 # Camada de Apresentação
    └── controller.ts             # Controller HTTP (NestJS)
```

**Por quê?**
- As regras de negócio ficam nas **Entities** do domínio, isoladas de qualquer framework.
- Os **Use Cases** orquestram o fluxo, delegando a persistência para contratos abstratos.
- Os **Repositories** são injetados via Dependency Injection do NestJS usando `abstract class` como token de injeção, permitindo trocar a implementação sem alterar o domínio.

**Exemplo:** O `ProducerContract` define a interface. O `ProducerRepository` implementa com SQL puro via `pg`. O NestJS resolve a dependência automaticamente:

```typescript
// Módulo registrando a implementação concreta via DI
{ provide: ProducerContract, useClass: ProducerRepository }
```

---

### Sistema de Autenticação (JWT + Redis Sessions)

O sistema de autenticação implementa um fluxo completo de **Access Token + Refresh Token** com sessões revogáveis:

**Fluxo de Login:**
1. O usuário envia email e senha
2. A senha é verificada contra o hash armazenado (bcrypt, 10 rounds)
3. São gerados dois tokens JWT:
   - **Access Token** (expira em 15min) — enviado no corpo da resposta
   - **Refresh Token** (expira em 7 dias) — armazenado como cookie `httpOnly`
4. O Refresh Token é salvo no Redis com chave `refresh_{userId}` e TTL de 7 dias

**Fluxo de Refresh:**
1. O servidor lê o cookie `refresh_token`
2. Verifica a assinatura do JWT com o `REFRESH_SECRET`
3. Valida se o token no cookie é **exatamente igual** ao armazenado no Redis (previne reutilização de tokens antigos)
4. Gera novos Access e Refresh Tokens (rotação)
5. Substitui o valor no Redis pelo novo Refresh Token

**Fluxo de Logout:**
1. O servidor deleta a chave `refresh_{userId}` do Redis
2. O cookie `refresh_token` é limpo no navegador

**Segurança do Cookie:**
```typescript
res.cookie('refresh_token', tokens.refreshToken, {
  httpOnly: true,                                    // Inacessível via JavaScript
  secure: process.env.NODE_ENV === 'production',     // HTTPS only em produção
  sameSite: 'strict',                                // Proteção contra CSRF
  path: '/auth/refresh',                             // Escopo restrito
  maxAge: 604800,                                    // 7 dias
});
```

---

### Sistema de Autorização (Guards)

A API implementa três níveis de guards que podem ser compostos de forma declarativa:

#### `AuthGuard` — Autenticação via Bearer Token
Extrai e verifica o JWT do header `Authorization: Bearer <token>`. Popula `request.producer` com o payload decodificado (id, username, role).

#### `RolesGuard` — Controle de Acesso por Role (RBAC)
Usa o decorator `@Roles()` para declarar quais roles podem acessar um endpoint. Exemplo de uso na rota de administração de migrations:

```typescript
@UseGuards(AuthGuard, RolesGuards)
@Roles(Role.ADMIN)
async executeMigrations() { ... }
```

#### `OwnerGuard` — Verificação Dinâmica de Propriedade do Recurso

Este é o guard mais sofisticado da aplicação. Ele resolve **dinamicamente** qual service usar para verificar ownership, através de metadados definidos pelo decorator `@OwnerService()`:

```typescript
// No Controller — declarativo e limpo
@UseGuards(AuthGuard, RolesGuards, OwnerGuard)
@OwnerService(IsCultureOwnerUseCase)           // ← injetado dinamicamente
async findById(@Param() params: CultureIdParams) { ... }

// Para recursos com chave de params diferente de "id"
@OwnerService(IsPropertyOwnerUseCase, 'propertyId')
async create(@Param() params: CultureIdParams) { ... }
```

**Como funciona internamente:**
1. O guard usa `Reflector` para ler os metadados do handler
2. Resolve o service de ownership via `ModuleRef` (IoC container do NestJS)
3. Chama `service.execute(producerId, resourceId)` que retorna um boolean
4. Se o usuário for `ADMIN`, o guard libera automaticamente sem verificar ownership
5. Se não for owner, lança `ForbiddenException`

Isso permite que qualquer novo módulo implemente seu próprio `IsXOwnerUseCase` e use o mesmo guard genérico sem modificar nenhum código compartilhado.

---

### Validação com Zod

Toda validação de entrada utiliza **Zod** integrado com NestJS via `nestjs-zod`:

```typescript
export const createProducerSchema = z.object({
  username: z.string().min(3).max(256).trim(),
  email: z.email().trim(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,36}$/)
    .trim(),
});

export class CreateProducerInput extends createZodDto(createProducerSchema) {}
```

O `ZodValidationPipe` é registrado globalmente no `main.ts`, garantindo que **todas** as requisições sejam validadas automaticamente antes de chegar ao controller.

As variáveis de ambiente também são validadas no startup via Zod (`envSchema`), impedindo que a aplicação inicie com configuração incompleta.

---

### Transações e Locks (PostgreSQL)

A aplicação utiliza **transações explícitas** e **row-level locks** (`SELECT ... FOR UPDATE`) para garantir integridade de dados em operações concorrentes:

**Transações:** O `DatabaseService` expõe um método `transaction()` que gerencia automaticamente `BEGIN`, `COMMIT` e `ROLLBACK`:

```typescript
async execute(id: string, dto: UpdateCultureInput): Promise<CultureOutput> {
  return await this.databaseService.transaction(async (client) => {
    // Lê com lock FOR UPDATE, impedindo leitura concorrente
    const culture = await this.cultureRepository.findById(id, client);

    culture.changeAllocatedArea = dto.allocatedArea;

    // Valida regras de negócio com dados consistentes
    const sumCrops = await this.cultureRepository.cropSum(id, client);
    if (sumCrops > culture.allocatedArea.getValue) {
      throw new BadRequestException('Sum of crops exceeds allocated area');
    }

    return await this.cultureRepository.update(culture, client);
  });
}
```

**Locks:** Queries de leitura dentro de transações usam `FOR UPDATE` para evitar race conditions em cenários como:
- Criação de propriedades (limite de 5 por produtor)
- Atualização de área alocada de culturas (validação de soma de crops)
- Verificação de ownership em operações concorrentes

---

### Value Objects

O domínio utiliza **Value Objects** para encapsular regras de validação e comportamento:

#### `Area`
Encapsula valores numéricos de área com validação de valor mínimo e arredondamento de precisão:

```typescript
export class Area {
  static create(value: number): Area {
    if (value < 0) throw new InvalidAreaError('Area must be greater than zero');
    return new Area(Math.round(value * 100) / 100);
  }

  sum(area: Area): Area {
    return Area.create(this.value + area.getValue);
  }
}
```

#### `Slug`
Gera slugs URL-friendly a partir de texto, normalizando caracteres Unicode, removendo acentos e formatando espaços:

```typescript
export class Slug {
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');
    return new Slug(slugText);
  }
}
```

---

### Mappers e Separação de Camadas

Cada módulo possui **Mappers** que convertem dados entre as camadas:

- **`toDomain()`** — Converte o resultado da query SQL (row do banco) em Entity de domínio
- **`toResponse()` / `toOutput()`** — Converte Entities de domínio em DTOs de resposta (sem dados sensíveis)

Isso garante que a camada de apresentação nunca receba dados internos (como `password_hash`) e que a entidade de domínio não dependa da estrutura do banco de dados.

---

## 🐳 Infraestrutura e DevOps

### Docker e Nginx

O ambiente local é orquestrado via `docker-compose.yml` com os seguintes serviços:

| Serviço | Imagem | Porta | Finalidade |
|---------|--------|-------|------------|
| **nginx** | `nginx:1.29` | `8080:80` | Reverse proxy para a API |
| **api** | Build local (`Dockerfile`) | `3000` (interna) | API NestJS com hot-reload |
| **postgres** | `postgres:16` | `5432` (interna) | Banco de dados com healthcheck |
| **redis** | `redis:8.2.3-alpine` | `6379` (interna) | Cache e sessões |

A API em produção usa um **multi-stage Dockerfile** (`prod.Dockerfile`) com 3 estágios:
1. **test-stage** — Instala dependências de dev e roda os testes
2. **build-stage** — Instala apenas dependências de produção e compila o TypeScript
3. **runtime** — Imagem final mínima, apenas com `node_modules` de produção e `dist/`

---

### CI/CD — GitHub Actions

Os pipelines de CI/CD são **separados por workspace** e otimizados com filtro de paths, garantindo que alterações em um workspace não disparem pipelines de outros:

| Workflow | Trigger | O que faz |
|----------|---------|-----------|
| `build-api.yml` | PR em `main`/`develop` — paths: `api/**` | Build da API |
| `test-api.yml` | PR em `main`/`develop` — paths: `api/**` | Testes unitários com PostgreSQL e Redis |
| `linting-api.yml` | PR em `main`/`develop` — paths: `api/**` | ESLint, Prettier e Commitlint |
| `deploy-api.yml` | Push em `main` — paths: `api/**` | Deploy via Render webhook |

O pipeline de testes levanta containers de **PostgreSQL** e **Redis** como service containers no GitHub Actions, executa as migrations e roda os testes unitários com Vitest.

---

### Qualidade de Código

| Ferramenta | Finalidade |
|------------|------------|
| **ESLint** | Linting de código TypeScript |
| **Prettier** | Formatação automática de código |
| **Commitlint** | Validação de mensagens de commit (Conventional Commits) |
| **Husky** | Git hooks para executar commitlint automaticamente no `commit-msg` |
| **Dependabot** | Atualização automática de dependências NPM e Docker |

---

## 📦 Módulos da API

### Auth (`/auth`)
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/login` | Login com email e senha | Não |
| `POST` | `/auth/refresh` | Renovação de tokens | Cookie |
| `GET` | `/auth/logout` | Logout (revoga sessão) | Bearer |

### Producer (`/producers`)
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/producers` | Buscar perfil do produtor logado | Bearer |
| `POST` | `/producers` | Criar novo produtor | Não |
| `PATCH` | `/producers` | Atualizar perfil | Bearer |
| `DELETE` | `/producers` | Deletar conta | Bearer |

### Property (`/property`)
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/property/:slug` | Buscar propriedade por slug | Bearer |
| `POST` | `/property` | Criar nova propriedade | Bearer |
| `PATCH` | `/property/:slug` | Atualizar propriedade | Bearer |
| `DELETE` | `/property/:slug` | Deletar propriedade | Bearer |

### Culture (`/:propertyId/cultures`)
| Método | Rota | Descrição | Auth + Owner |
|--------|------|-----------|------|
| `GET` | `/:propertyId/cultures/:id` | Buscar cultura por ID | Bearer + OwnerGuard |
| `POST` | `/:propertyId/cultures` | Criar nova cultura | Bearer + OwnerGuard |
| `PATCH` | `/:propertyId/cultures/:id` | Atualizar cultura | Bearer + OwnerGuard |
| `DELETE` | `/:propertyId/cultures` | Deletar cultura | Bearer + OwnerGuard |

### Migration (`/migration`) — Admin Only
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/migration` | Listar migrations pendentes (dry-run) | Bearer + Admin |
| `POST` | `/migration` | Executar migrations | Bearer + Admin |

> A documentação interativa completa está disponível via Swagger em `/api`.

---

## 🗄 Modelo de Dados

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐       ┌──────────────┐
│  producers   │       │   properties     │       │   cultures   │       │    crops      │
├──────────────┤       ├──────────────────┤       ├──────────────┤       ├──────────────┤
│ producerId   │──┐    │ propertyId       │──┐    │ cultureId    │──┐    │ cropId       │
│ username     │  │    │ producerId    (FK)│  │    │ propertyId(FK)│  │    │ cultureId(FK)│
│ email        │  └───▶│ name             │  │    │ name         │  └───▶│ name         │
│ hashedPasswd │       │ slug (UNIQUE)    │  └───▶│ allocatedArea│       │ status       │
│ role         │       │ city             │       │ createdAt    │       │ allocatedArea│
│ createdAt    │       │ state            │       │ updatedAt    │       │ plantingDate │
│ updatedAt    │       │ totalArea        │       └──────────────┘       │ harvestExpect│
└──────────────┘       │ arableArea       │                             │ harvestActual│
                       │ vegetationArea   │                             │ pestsStatus  │
                       │ createdAt        │                             │ createdAt    │
                       │ updatedAt        │                             │ updatedAt    │
                       └──────────────────┘                             └──────────────┘
```

**Cascade Deletes:** Deletar um produtor remove todas as suas propriedades, que por sua vez removem suas culturas e safras automaticamente.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v26+
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Devgustavogomes/AgroManager-backend.git
cd AgroManager-backend

# Instale as dependências de todo o monorepo
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
```

### Rodando com Docker

```bash
# Sobe todos os containers (API + Postgres + Redis + Nginx)
npm run compose:up

# Ou com rebuild de imagens
npm run compose:build
```

A API estará acessível em `http://localhost:8080` (via Nginx).

### Rodando sem Docker (apenas a API)

```bash
# Certifique-se de ter PostgreSQL e Redis rodando localmente
npm run start:dev -w api
```

### Rodando Migrations

```bash
npm run migrate
```

### Rodando Testes

```bash
npm run test -w api
```

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3000

# PostgreSQL
PGUSER=local_pg
PGPASSWORD=local_password_pg
PGHOST=postgres
PGPORT=5432
PGDATABASE=local_pg
PGSSLMODE=disable

# JWT
SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_USERNAME=default

# Docker (Postgres)
POSTGRES_USER=local_pg
POSTGRES_PASSWORD=local_password_pg
POSTGRES_DB=local_pg
```

---

## 📜 Scripts Disponíveis

### Raiz do Monorepo

| Script | Comando | Descrição |
|--------|---------|-----------|
| `compose:up` | `docker compose up` | Sobe todos os containers |
| `compose:build` | `docker compose up --build` | Sobe com rebuild de imagens |
| `compose:stop` | `docker compose stop` | Para todos os containers |
| `compose:down` | `docker compose down` | Remove todos os containers |
| `migrate` | `node-pg-migrate up` | Executa migrations |

### API Workspace (`-w api`)

| Script | Comando | Descrição |
|--------|---------|-----------|
| `start:dev` | `nest start --watch` | Desenvolvimento com hot-reload |
| `start:prod` | `node dist/src/main` | Execução em produção |
| `build` | `nest build` | Compila o TypeScript |
| `test` | `vitest run` | Roda testes unitários |
| `test:watch` | `vitest` | Roda testes em modo watch |
| `lint` | `eslint --fix` | Lint com auto-fix |
| `format` | `prettier --write` | Formatação automática |

---

## 🗺 Roadmap

- [x] Estrutura do monorepo com NPM Workspaces
- [x] API — Módulo de Autenticação (JWT + Redis)
- [x] API — CRUD de Produtores com DDD
- [x] API — CRUD de Propriedades com Value Objects
- [x] API — CRUD de Culturas com OwnerGuard dinâmico
- [x] API — Transações e Locks para integridade de dados
- [x] API — Swagger para documentação
- [x] API — Testes unitários com Vitest
- [x] Docker Compose para ambiente local
- [x] CI/CD com GitHub Actions por workspace
- [ ] API — CRUD de Crops (safras) — em progresso
- [ ] API — Dashboard com métricas agregadas
- [ ] Web — Interface do produtor (Next.js)
- [ ] Workers — Processamento assíncrono de tarefas

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

Desenvolvido por [Gustavo Gomes](https://github.com/Devgustavogomes)
