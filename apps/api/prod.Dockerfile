FROM node:26.9 AS pruner

RUN corepack enable

WORKDIR /usr/src/app

COPY . .

RUN pnpm dlx turbo@2.11.10 prune api --docker


FROM node:26.9 AS builder

RUN corepack enable

WORKDIR /usr/src/app

COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /usr/src/app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY .npmrc ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /usr/src/app/out/full/ .
COPY turbo.json ./

RUN pnpm turbo run test --filter=api
RUN pnpm turbo run build --filter=api


FROM node:26.9 AS runner

RUN corepack enable

WORKDIR /usr/src/app

COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /usr/src/app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY .npmrc ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=builder /usr/src/app/apps/api/src/shared/infrastructure/database/migrations ./apps/api/src/shared/infrastructure/database/migrations

CMD ["pnpm", "--filter", "api", "run", "start:prod"]
