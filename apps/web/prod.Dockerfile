FROM node:26.9 AS pruner

RUN corepack enable

WORKDIR /usr/src/app

COPY . .

RUN pnpm dlx turbo@2.11.10 prune web --docker


FROM node:26.9 AS build-stage

RUN corepack enable

WORKDIR /usr/src/app

COPY --from=pruner /usr/src/app/out/json/ .
COPY --from=pruner /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /usr/src/app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY .npmrc ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=pruner /usr/src/app/out/full/ .
COPY turbo.json ./

RUN pnpm turbo run build --filter=web


FROM nginx:alpine

COPY --from=build-stage /usr/src/app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
