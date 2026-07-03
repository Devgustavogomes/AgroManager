# Reavaliação da Codebase v3 — AgroManager Backend

> Reavaliação feita comparando o estado **atual** do código (excluindo `/web` e `/workers`) com os critérios da [avaliação v2](file:///c:/Users/gustavo/projetos/AgroManager-backend/updated_codebase_review_v2.md). Itens ~~riscados~~ foram corrigidos desde a v2. Itens com 💬 são comentários meus sobre pontos que achei relevantes.

---

## 1. Arquitetura Geral — **9/10** (antes: 8.5) ↑

### ✅ O que melhorou desde v2:

- ~~`createCulture` no controller recebia `params.id!` sem `:id` na rota~~ → O [CultureController](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/presentation/culture.controller.ts#L53) agora usa `params.slug` corretamente para criar cultures. **Bug corrigido.**
- **`GlobalErrorHandler`** criado em [globalErrorHandler.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/shared/filters/globalErrorHandler.ts) e registrado no `AppModule` via `APP_FILTER` — domain errors agora são mapeados corretamente para HTTP status.
- **Hierarquia de domain errors** bem definida: `BaseError` → `InvalidAreaError` (422), `NotFoundError` (404), `ConflictError` (409), `ForbiddenError` (403), `UnauthorizedError` (401). Todos os domain services e use cases agora usam esses domain errors.
- ~~`ValidateMaxProperties` usava `BadRequestException` do NestJS~~ → Agora usa `ConflictError` (domain error) em [validateMaxProperties.service.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/property/domain/services/validateMaxProperties.service.ts).
- ~~`AuthRepository` usava `RedisService` diretamente~~ → Agora injeta `CacheContract` corretamente em [auth.repository.ts:15](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/auth/infrastructure/persistence/auth.repository.ts#L15).

### ⚠️ O que ainda permanece:

- O módulo `migration` continua flat — [controller.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/migration/controller.ts), [service.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/migration/service.ts), [module.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/migration/module.ts) direto na pasta, sem camadas. Funciona, mas é inconsistente com o resto.
- **Docker compose não monta o workspace `infra/`** — [docker-compose.yml:19](file:///c:/Users/gustavo/projetos/AgroManager-backend/docker-compose.yml#L19) volume monta apenas `./api:/usr/src/app`. Se `infra/` mudar, o container dev não reflete.

💬 A arquitetura está bem madura agora. Todos os 5 módulos de negócio seguem as 4 camadas (domain/application/infrastructure/presentation), o `infra/` workspace está correto, e os domain errors formam uma hierarquia coesa com o GlobalErrorHandler. A melhoria no desacoplamento (AuthRepository usando CacheContract) e a correção do bug do CultureController são significativas.

---

## 2. Organização e Nomenclatura — **8/10** (antes: 8)

### ⚠️ O que ainda permanece:

- **Sem style guide documentado** — sem `CONTRIBUTING.md` nem seção de convenções.
- **Nomenclatura dos getters já padronizada** — `Property` agora usa `get name`, `get slug`, etc. (sem prefixo `get`), consistente com `Culture`, `Crop`, `Producer`. ✅ **Corrigido desde v2!**
- **Nomenclatura dos arquivos de contract inconsistente**: `producerRepository.contract.ts`, `authRepository.contract.ts`, `cultureRepository.interface.ts` (`.interface` em vez de `.contract`), `cropsRepository.contract.ts` (plural). Três padrões diferentes.

### 🆕 Novos achados:

- **Controllers ainda usam `params.id!`** com non-null assertion — [culture.controller.ts:42](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/presentation/culture.controller.ts#L42), [culture.controller.ts:64](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/presentation/culture.controller.ts#L64), [culture.controller.ts:71](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/presentation/culture.controller.ts#L71), [crops.controller.ts:61](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/presentation/crops.controller.ts#L61), [crops.controller.ts:69](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/presentation/crops.controller.ts#L69), etc. O `id` é `z.uuid().optional()` no DTO, então o `!` força o TypeScript a aceitar `undefined` como `string`. Deveria validar ou separar DTOs.

💬 Os getters foram padronizados — boa evolução. Falta padronizar os nomes dos arquivos de contract e documentar um style guide.

---

## 3. Design Patterns — **8.5/10** (antes: 8) ↑

### ✅ O que melhorou desde v2:

- ~~`ValidateMaxProperties` usava `BadRequestException` do NestJS dentro do domain~~ → Agora usa `ConflictError`. **Todos os domain services agora usam domain errors exclusivamente.**
- **`ValidateCultureAreaService`**, **`ValidateCultureCropsAreaService`** e **`ValidateMaxProperties`** — 3 domain services puros, sem dependências de framework.
- **OwnerGuard agora usa domain errors** (`UnauthorizedError`, `ForbiddenError`) em vez de NestJS exceptions.

### ⚠️ O que ainda permanece:

- **Mappers `toDomain` recebem arrays e retornam arrays** para cenários de single entity — [ProducerMapper](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/producer/infrastructure/persistence/producer.mapper.ts), [CropMapper](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/crop.mapper.ts), [CultureMapper](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/culture.mapper.ts). Isso força `[result][0]` nos repositories e use cases. O `PropertyMapper` tem o `toResponse(entity: Property)` para single entity — os outros deveriam ter também.

💬 O `PropertyMapper.toResponse` recebe uma entidade única e retorna um DTO — é o padrão correto. Recomendo adicionar `toDomain(data: Persistence): Entity` como sobrecarga nos outros mappers para eliminar `[0]`.

---

## 4. Desacoplamento — **8.5/10** (antes: 7.5) ↑↑

### ✅ O que melhorou significativamente desde v2:

- ~~`AuthRepository` usava `RedisService` diretamente~~ → Agora injeta `CacheContract` em [auth.repository.ts:15](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/auth/infrastructure/persistence/auth.repository.ts#L15). ✅
- ~~`PoolClient` do `pg` nos contracts de domínio~~ → Os contracts [cropsRepository.contract.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/domain/repositories/cropsRepository.contract.ts), [propertyRepository.contract.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/property/domain/repositories/propertyRepository.contract.ts), e [cultureRepository.interface.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/domain/repositories/cultureRepository.interface.ts) agora usam `unknown` em vez de `PoolClient`. **Excelente melhoria** — o domain não importa mais `pg`. ✅
- ~~`ValidateMaxProperties` usava `BadRequestException` do NestJS~~ → Domain puro agora. ✅
- **OwnerGuard** usa domain errors em vez de NestJS exceptions.

### ⚠️ O que ainda permanece:

- **`Persistence` interfaces no domain layer** — `CropPersistence`, `PropertyPersistence`, `CulturePersistence`, `ProducerPersistence` estão nos contracts de domain. Representam esquema de banco de dados — tecnicamente infraestrutura. Mas reconheço a decisão de design.
- **`CreateCropUseCase` importa `ValidateCultureCropsAreaService`** do módulo `culture/domain/services/` — [createCrop.ts:8](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/application/use-cases/createCrop.ts#L8). Acoplamento cruzado entre módulos. O service deveria estar em `shared/` se é usado por múltiplos módulos.
- **Use cases importam `Mapper` da camada infrastructure** — ex: [createProperty.ts:1](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/property/application/use-cases/createProperty.ts#L1) importa `PropertyMapper` de `../../infrastructure/persistence/property.mapper`. A camada `application` não deveria conhecer a `infrastructure`.
- **`CreatePropertyUseCase` importa `PoolClient`** diretamente — [createProperty.ts:8](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/property/application/use-cases/createProperty.ts#L8). O domain contract usa `unknown`, mas o use case tipa o callback explicitamente como `PoolClient`.

💬 Evolução gigante. Remover `PoolClient` dos contracts e fazer o `AuthRepository` usar `CacheContract` foram as correções mais impactantes para desacoplamento. O import de `PoolClient` residual no `CreatePropertyUseCase` é um detalhe isolado.

### 🆕 Achados:

- **`CropRepository`** (implementação) ainda importa `PoolClient` do `pg` — [crop.repository.ts:8](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L8). Isso é correto para a camada de infra, está no lugar certo.
- **`CultureRepository`** (implementação) importa `PoolClient` — [culture.repository.ts:10](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/persistence/culture.repository.ts#L10). Correto para infra.

---

## 5. Segurança — **7.5/10** (antes: 6) ↑↑

### ✅ O que melhorou significativamente desde v2:

- ~~Sem CORS configurado~~ → `app.enableCors()` configurado com `origin`, `credentials`, `allowedHeaders`, `methods` em [main.ts:31-36](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/main.ts#L31-L36). ✅
- ~~Sem helmet~~ → `helmet` implementado com configuração detalhada em [main.ts:38-47](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/main.ts#L38-L47). Inclui `crossOriginOpenerPolicy`, `crossOriginResourcePolicy`, `referrerPolicy`, e `strictTransportSecurity` condicional por ambiente. ✅
- ~~`AuthMapper.toDomain(producer[0])` crashava se email não existisse~~ → [auth.mapper.ts:5-8](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/auth/infrastructure/auth.mapper.ts#L5-L8) agora aceita `undefined` e retorna `null`. E o [auth.repository.ts:18](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/auth/infrastructure/persistence/auth.repository.ts#L18) tem retorno tipado como `ProducerLogin | null`. ✅
- **Segurança refatorada em `setupSecurity()`** — [main.ts:25-47](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/main.ts#L25-L47). Boa organização separando setup de segurança e Swagger.

### ⚠️ O que ainda permanece:

- **Sem rate limiting** em rotas de autenticação (`POST /auth/login`, `POST /auth/refresh`). Vulnerável a brute-force.
- **`SELECT *` no `findById` do producer** — [producer.repository.ts:15-18](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/producer/infrastructure/persistence/producer.repository.ts#L15-L18) retorna `hashedPassword` desnecessariamente.
- **`JwtPayload extends Record<string, any>`** — [jwtPayload.ts:3](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/shared/types/jwtPayload.ts#L3) abre o tipo completamente.
- **Cookie `refresh_token` não configura `domain`** — em produção com subdomínios pode causar problemas.

💬 A adição de CORS e Helmet foi a mudança de segurança mais impactante. O `setupSecurity` bem estruturado mostra maturidade na organização. O null check no AuthMapper elimina um crash potencial em produção. Falta rate limiting para ser completo.

---

## 6. Tratamento de Erros — **7.5/10** (antes: 5) ↑↑↑

### ✅ O que melhorou massivamente desde v2:

- ~~Sem Exception Filter global~~ → **`GlobalErrorHandler`** criado em [globalErrorHandler.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/shared/filters/globalErrorHandler.ts) e registrado em [app.module.ts:36-38](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/app.module.ts#L36-L38). Extends `BaseExceptionFilter`, captura `BaseError` e mapeia para HTTP status correto. Fallback para o `super.catch()` para erros do NestJS. ✅
- ~~`ValidateMaxProperties` lançava `BadRequestException` do NestJS dentro do domain~~ → Agora lança `ConflictError` (409). ✅
- ~~`AuthMapper.toDomain(producer[0])` crashava~~ → Null check implementado. ✅
- **Hierarquia de domain errors completa**: `BaseError` → 5 subclasses cobrindo 401, 403, 404, 409, 422. Cada uma com `statusCode`, `errorName`, `errorMessage`.
- ~~Transação aninhada no `UpdateCropUseCase`~~ → [updateCrop.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/application/use-cases/updateCrop.ts) agora usa uma única transação. ✅
- **`FindCropByIdUseCase` agora verifica se o crop existe** — [findCropById.ts:14-16](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/application/use-cases/findCropById.ts#L14-L16) lança `NotFoundError`. ✅

### ⚠️ O que ainda permanece:

- **`console.log` e `console.error` como único logging** — [service.ts:22](file:///c:/Users/gustavo/projetos/AgroManager-backend/infra/database/service.ts#L22), [main.ts:21](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/main.ts#L21). Sem logger estruturado (NestJS Logger, pino, winston), sem níveis, sem correlação de requests.
- **`CropRepository.isOwner()`** — [crop.repository.ts:190](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L190) `query<boolean>` mas `SELECT EXISTS` retorna `{ exists: boolean }`, não `boolean` direto. O tipo genérico não valida isso em runtime.

### 🆕 Novos achados:

- **`CropRepository.getCultureArea` e `getCropsArea`** — [crop.repository.ts:56](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L56) e [crop.repository.ts:73](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L73) usam `query<number>` mas a query retorna objetos `{ allocatedArea: number }` e `{ coalesce: number }` respectivamente. O `result[0]` retorna o **objeto**, não o número. Potencial bug: `Area.create({ allocatedArea: 10 })` recebe objeto em vez de número.

💬 Esta foi a **maior evolução** entre v2 e v3. O GlobalErrorHandler com a hierarquia de domain errors é um upgrade arquitetural significativo. O código passou de "erros descontrolados" para "erros tratados por design". Recomendo substituir `console.log` pelo NestJS Logger como próximo passo.

---

## 7. Testes — **6.5/10** (antes: 6) ↑

### ✅ O que melhorou desde v2:

- **Novos testes de crop**: [createCrop.spec.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/application/use-cases/createCrop.spec.ts), [updateCrop.spec.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/application/use-cases/updateCrop.spec.ts).
- **Total: 13 test files**, cobrindo use cases de todos os módulos de negócio.

### ⚠️ O que ainda permanece:

- **Sem testes de integração** — nenhum teste com banco real ou Redis.
- **Sem testes E2E** — supertest disponível mas não usado.
- **Sem testes nas entities de domínio** — `Property`, `Crop`, `Area`, `Slug` têm lógica rica (validação de áreas, criação de slugs, update atômico) mas zero testes unitários.
- **Sem testes nos guards** — `AuthGuard`, `OwnerGuard`, `RolesGuard` não testados.
- **Cobertura de testes não é aferida no CI** — o workflow roda `npm run test` mas não `npm run test:cov`.
- **Testes verificam apenas happy path** — [createCrop.spec.ts](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/application/use-cases/createCrop.spec.ts) tem 1 único teste. Sem cenários de erro (área inválida, crop não encontrado, etc).
- **`mockDatabaseService.transaction` recebe `{}`** como client — [createCrop.spec.ts:23-26](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/application/use-cases/createCrop.spec.ts#L23-L26) funciona para o mock mas esconde bugs.

💬 Os testes cobrem os happy paths dos use cases, o que é um bom começo. A prioridade agora deveria ser: (1) testes de entities/value objects (são puros e rápidos), (2) cenários de erro nos use cases, (3) testes E2E para endpoints críticos como `/auth/login`.

---

## 8. Escalabilidade — **6/10** (antes: 5) ↑

### ✅ O que melhorou desde v2:

- ~~Sem indexação~~ → Nova migration [1782936470877_create-indexs.sql](file:///c:/Users/gustavo/projetos/AgroManager-backend/migrations/1782936470877_create-indexs.sql) cria indexes nas 3 FKs: `idx_properties_producerId`, `idx_cultures_propertyId`, `idx_crops_cultureId`. ✅
- **`COALESCE(SUM(...), 0)` adicionado** em [culture.repository.ts:102](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/persistence/culture.repository.ts#L102) (`cropSum`) e [culture.repository.ts:136](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/persistence/culture.repository.ts#L136) (`cultureAreaSum`). ✅
- **`CropRepository.getCropsArea` também usa `COALESCE`** — [crop.repository.ts:66](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L66). ✅
- **`CultureRepository.isOwner` com alias** — [culture.repository.ts:161](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/persistence/culture.repository.ts#L161) `AS hasProperty`, e tipado como `{ hasProperty: boolean }`. ✅
- **`CultureRepository.cropSum` com alias** — [culture.repository.ts:102](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/persistence/culture.repository.ts#L102) `as sum`, tipado como `{ sum: number }`. ✅

### ⚠️ O que ainda permanece:

- **Sem paginação** — nenhuma rota implementa pagination.
- **Sem caching** — Redis usado apenas para refresh tokens.
- **Single migration file** com todas as tabelas (+ uma para indexes agora).
- **Sem health check endpoint**.
- **`SELECT *`** usado em repositories — retorna todas as colunas sempre. O `AuthRepository.findProducer` é o único que seleciona colunas específicas.
- **`findByCulture` retorna TODOS os crops** de uma culture sem limite — [crop.repository.ts:33-46](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L33-L46).

💬 A adição dos indexes nas FKs e dos COALESCE são melhorias práticas que evitam problemas reais em produção. Os indexes em particular são críticos para queries de JOIN (isOwner).

---

## 9. TypeScript — **7.5/10** (antes: 6.5) ↑

### ✅ O que melhorou desde v2:

- ~~`strict: true` não habilitado~~ → **Agora `strict: true`** em [tsconfig.json:30](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/tsconfig.json#L30)! ✅
- `strictNullChecks: true`, `forceConsistentCasingInFileNames: true` mantidos.

### ⚠️ O que ainda permanece:

- **`noImplicitAny: false`** — [tsconfig.json:27](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/tsconfig.json#L27). Com `strict: true` e `noImplicitAny: false`, uma flag está sobrepondo a outra (`strict` habilita `noImplicitAny`, mas a flag explícita desabilita).
- **`strictBindCallApply: false`** — [tsconfig.json:28](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/tsconfig.json#L28). Mesma situação.
- **`DatabaseContract.query` usa `any[]`** como params — [contract.ts:7](file:///c:/Users/gustavo/projetos/AgroManager-backend/infra/database/contract.ts#L7).
- **`JwtPayload extends Record<string, any>`** — tipo aberto.
- **`eslint-disable`** em [refresh.ts:1](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/auth/application/use-cases/refresh.ts#L1) (`@typescript-eslint/no-unused-vars`) e [service.ts:1](file:///c:/Users/gustavo/projetos/AgroManager-backend/infra/database/service.ts#L1) (`@typescript-eslint/no-unsafe-return`).
- **Non-null assertions (`!`)** nos controllers — ~6 ocorrências para `params.id!`.

### 🆕 Achados:

- **`CropRepository.getCultureArea` e `getCropsArea`** — `query<number>` retorna `{ allocatedArea }` e `{ coalesce }` — o genérico mente sobre o tipo real.
- **`CropRepository.isOwner`** — `query<boolean>` deveria ser `query<{ exists: boolean }>`.

💬 Habilitar `strict: true` é um marco. As flags `noImplicitAny: false` e `strictBindCallApply: false` contradizem o `strict: true` — remover essas flags explícitas deixaria o `strict` fazer seu trabalho completo.

---

## 10. CI/CD e DevOps — **7/10** (antes: 7)

### ⚠️ O que ainda permanece (sem mudanças desde v2):

- **`prod.Dockerfile`** — `build-stage` faz `npm ci --omit=dev` e depois `npm run build`. O build requer devDependencies (TypeScript, NestJS CLI). **O build vai falhar.** O `test-stage` não é usado pelo `build-stage`.
- **`deploy-api.yml`** apenas chama um webhook do Render sem verificar build/test.
- **`test.yml` e `build.yml`** rodam na raiz do monorepo (`npm ci`) e executam em todos os workspaces.
- **Docker compose dev** usa `npm install` em vez de `npm ci` — [Dockerfile:7](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/Dockerfile#L7).
- **Docker compose não monta `infra/`** — `./api:/usr/src/app` não inclui `../infra`.

💬 O `prod.Dockerfile` continua com o bug de `--omit=dev` antes do build. Sugestão: usar `npm ci` completo no `build-stage`, rodar `npm run build`, e depois copiar apenas `dist/` e `node_modules` (sem devDeps) para o stage final.

---

## 11. DDD e Domain Modeling — **8/10** (antes: 7) ↑

### ✅ O que melhorou desde v2:

- ~~`ValidateMaxProperties` lançava `BadRequestException`~~ → Usa `ConflictError` agora. **Todos os domain services são puros.** ✅
- ~~`Property.validateAreas()` comparava objetos `Area` com `>`~~ → [property.entity.ts:94](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/property/domain/entities/property.entity.ts#L94) agora usa `sum.getValue > this.props.totalArea.getValue`. **Bug crítico corrigido!** ✅
- **OwnerGuard usa domain errors** — a camada de guards agora é consistente com o domain.
- **Domain contracts usam `unknown` em vez de `PoolClient`** — o domain não conhece mais o `pg`. ✅

### ⚠️ O que ainda permanece:

- **Sem Aggregate Root explícito** — `Property` não gerencia suas `Cultures`/`Crops`.
- **Sem domain events** implementados (a infra existe mas `domainEvents` é sempre `[]`).
- **`Persistence` interfaces no domain layer**.
- **`Culture` entity valida `allocatedArea < 1`** — [culture.entity.ts:50](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/domain/entities/culture.entity.ts#L50) mas `Crop` entity valida `allocatedArea <= 0` — [crop.entity.ts:95](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/domain/entities/crop.entity.ts#L95). Semântica diferente para a mesma regra (area mínima). Culture rejeita area 0.5, Crop aceita.
- **IDs default como `'non-registered'`** — [crop.entity.ts:35](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/domain/entities/crop.entity.ts#L35), [culture.entity.ts:28](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/domain/entities/culture.entity.ts#L28), [producer.entity.ts:27](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/producer/domain/entities/producer.entity.ts#L27). Magic string que pode vazar para a API via [property.mapper.ts:24](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/property/infrastructure/persistence/property.mapper.ts#L24) (`entity.propertyId ?? 'non-registered'`).
- **`CreatedAt` type inconsistente**: `Producer` usa `Date | string`, `Culture` usa `Date | string`, mas `Property` e `Crop` usam `Date` apenas.

💬 Corrigir o bug do `Area` comparison e purificar todos os domain services foram passos fundamentais. O DDD está numa posição boa — próximos passos seriam implementar domain events e padronizar a semântica de area mínima.

---

## 12. Qualidade do SQL e Data Layer — **7/10** (antes: 5) ↑↑

### ✅ O que melhorou massivamente desde v2:

- ~~`CropRepository.update()` com SQL syntax error (falta vírgula)~~ → [crop.repository.ts:124-156](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L124-L156) SQL agora correto, sem vírgula faltando. ✅
- ~~`CropRepository.update()` com parâmetros na ordem errada~~ → Ordem dos params agora bate com o SQL: `$1=name, $2=status, $3=allocatedArea, $4=plantingDate, $5=harvestDateExpected, $6=harvestDateActual, $7=pestStatus, $8=cropId`. ✅
- ~~Migration `"pestsStatus"` vs código `"pestStatus"`~~ → A migration [1759950210502_initial.sql:55](file:///c:/Users/gustavo/projetos/AgroManager-backend/migrations/1759950210502_initial.sql#L55) já usa `"pestStatus"` (sem `s`). Consistente com o código. ✅
- ~~`SUM()` sem `COALESCE`~~ → `COALESCE(SUM(...), 0)` adicionado em `cultureAreaSum`, `cropSum` e `getCropsArea`. ✅
- ~~Sem indexes nas FKs~~ → [1782936470877_create-indexs.sql](file:///c:/Users/gustavo/projetos/AgroManager-backend/migrations/1782936470877_create-indexs.sql) com 3 indexes. ✅
- **`CultureRepository.isOwner` com alias** — `AS hasProperty` e tipo `{ hasProperty: boolean }`. ✅
- **`CultureRepository.cropSum` com alias** — `as sum` e tipo `{ sum: number }`. ✅

### ⚠️ O que ainda permanece:

- **`properties.slug` é `UNIQUE` globalmente** — [1759950210502_initial.sql:16](file:///c:/Users/gustavo/projetos/AgroManager-backend/migrations/1759950210502_initial.sql#L16). Dois producers diferentes não podem ter propriedades com o mesmo nome/slug. Deveria ser `UNIQUE(slug, "producerId")`.
- **`COALESCE` no UPDATE** — [producer.repository.ts:52-53](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/producer/infrastructure/persistence/producer.repository.ts#L52-L53) e [culture.repository.ts:76-77](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/persistence/culture.repository.ts#L76-L77). O entity já foi atualizado via `update()` — o COALESCE é redundante e pode causar comportamento inesperado com strings vazias.
- **`CropRepository.isOwner`** — [crop.repository.ts:190](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L190) `query<boolean>` mas `SELECT EXISTS` retorna `{ exists: boolean }`, não `boolean`. Sem alias, o resultado pode variar por versão do driver `pg`.
- **`CropRepository.getCultureArea`** — [crop.repository.ts:56](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L56) `query<number>` mas retorna `{ allocatedArea: number }`. O `result[0]` será o objeto, não o número.
- **`FOR UPDATE` em queries de leitura** — [culture.repository.ts:160](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/culture/infrastructure/persistence/culture.repository.ts#L160) `isOwner` faz `FOR UPDATE` dentro de `SELECT EXISTS`. O `isOwner` é chamado no guard (sem transação), então o `FOR UPDATE` não tem efeito prático e pode bloquear rows desnecessariamente.

💬 A correção do SQL syntax error, params order, e adição de COALESCE foram críticas — transformaram código que crashava em runtime em código funcional. Os indexes garantem performance nas queries de ownership.

---

## Resumo Comparativo

| Critério                   |   v1    |   v2    |   v3    |    Δ (v2→v3)     | Status |
| -------------------------- | :-----: | :-----: | :-----: | :--------------: | :----: |
| Arquitetura Geral          |  **8**  | **8.5** |  **9**  |      +0.5        |   🟢   |
| Organização e Nomenclatura |  **8**  |  **8**  |  **8**  |        0         |   🟢   |
| Design Patterns            |  **7**  |  **8**  | **8.5** |      +0.5        |   🟢   |
| Desacoplamento             |  **7**  | **7.5** | **8.5** |       +1         |   🟢   |
| Segurança                  |  **6**  |  **6**  | **7.5** |      +1.5        |   🟡   |
| Tratamento de Erros        |  **4**  |  **5**  | **7.5** |      +2.5        |   🟡   |
| Testes                     |  **5**  |  **6**  | **6.5** |      +0.5        |   🟡   |
| Escalabilidade             |  **5**  |  **5**  |  **6**  |       +1         |   🟡   |
| TypeScript                 |  **6**  | **6.5** | **7.5** |       +1         |   🟡   |
| CI/CD e DevOps             |  **7**  |  **7**  |  **7**  |        0         |   🟡   |
| DDD e Domain Modeling      |  **6**  |  **7**  |  **8**  |       +1         |   🟢   |
| SQL e Data Layer           |    —    |  **5**  |  **7**  |       +2         |   🟡   |
| **Média Geral**            | **6.3** | **6.6** | **7.5** |    **+0.9**      |   🟡   |

---

## 📊 Evolução Geral

> [!TIP]
> A codebase deu um salto de qualidade significativo — de **6.6 → 7.5** (+0.9). As maiores melhorias foram em **Tratamento de Erros (+2.5)**, **SQL/Data Layer (+2)**, **Segurança (+1.5)**, **Desacoplamento (+1)**, **TypeScript (+1)** e **DDD (+1)**.

### 🏆 Destaques desta iteração:
1. **GlobalErrorHandler + hierarquia de domain errors** — mudança arquitetural mais impactante
2. **CORS + Helmet** — segurança básica coberta
3. **PoolClient removido dos contracts de domain** — desacoplamento real
4. **Bug crítico do Area comparison corrigido** — `sum.getValue > totalArea.getValue`
5. **SQL bugs corrigidos** — syntax error, params order, COALESCE, indexes
6. **`strict: true`** no tsconfig
7. **AuthRepository usando CacheContract** — desacoplamento do Redis
8. **Todos os domain services puros** — sem imports de NestJS

---

## 🚨 Bugs Remanescentes para Resolver

### 1. `CropRepository.isOwner()` — tipagem e retorno incorreto

**Arquivo**: [crop.repository.ts:176-193](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L176-L193)

- `query<boolean>` mas `SELECT EXISTS` sem alias retorna `{ exists: boolean }`
- `result[0]` retorna o objeto, não o boolean
- **Fix**: Adicionar alias `AS "isOwner"` e mudar para `query<{ isOwner: boolean }>`, retornar `result[0].isOwner`

### 2. `CropRepository.getCultureArea()` — tipo genérico incorreto

**Arquivo**: [crop.repository.ts:48-63](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/crop/infrastructure/persistence/crop.repository.ts#L48-L63)

- `query<number>` mas query retorna `{ allocatedArea: number }`
- `result[0]` é um objeto, não um número
- **Fix**: Mudar para `query<{ allocatedArea: number }>` e retornar `result[0].allocatedArea`

### 3. `prod.Dockerfile` — build vai falhar

**Arquivo**: [prod.Dockerfile:19-25](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/prod.Dockerfile#L19-L25)

- `npm ci --omit=dev` seguido de `npm run build` — build precisa de devDependencies
- **Fix**: Usar `npm ci` (sem --omit=dev) no build-stage

### 4. `CreatePropertyUseCase` importa `PoolClient` diretamente

**Arquivo**: [createProperty.ts:8](file:///c:/Users/gustavo/projetos/AgroManager-backend/api/src/modules/property/application/use-cases/createProperty.ts#L8)

- Os contracts de domain usam `unknown`, mas esse use case tipa `PoolClient` explicitamente
- **Fix**: Remover import de `PoolClient` e usar `(client: unknown)` ou `(client)` sem tipo

---

## O que mais impactaria a nota (Próximos Passos)

### 🟠 Impacto Alto — Fazendo essas, a média sobe para ~8.0+

1. **Corrigir bugs 1-4 acima** (+0.5 em SQL, +0.5 em TypeScript)
2. **Adicionar rate limiting** em `/auth/login` e `/auth/refresh` (+0.5 em Segurança)
3. **Adicionar testes para entities e value objects** (Area, Slug, Property) (+1 em Testes)
4. **Corrigir `prod.Dockerfile`** — build-stage precisa de devDeps (+1 em CI/CD)
5. **Remover `noImplicitAny: false` e `strictBindCallApply: false`** do tsconfig (+0.5 em TypeScript)
6. **Substituir `console.log` pelo NestJS Logger** (+0.5 em Tratamento de Erros)

### 🟡 Impacto Médio

7. Padronizar nomes dos contract files (`.contract.ts` em todos)
8. Adicionar paginação nas rotas de listagem
9. Adicionar health check endpoint
10. Mover `ValidateCultureCropsAreaService` para `shared/` (eliminar import cross-module)
11. Padronizar validação de area mínima (Culture `< 1` vs Crop `<= 0`)
12. Eliminar magic string `'non-registered'` — usar `undefined` ou gerar UUID no domain
13. Adicionar `UNIQUE(slug, "producerId")` em vez de `UNIQUE(slug)` na migration

> 🟢 = 8-10 | 🟡 = 6-7.9 | 🔴 = 0-5.9
