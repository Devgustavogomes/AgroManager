FROM node:26.9 AS test-stage

WORKDIR /usr/src/app


COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY apps/workers/package*.json ./apps/workers/
COPY commitlint.config.js ./

RUN npm ci --include=dev --ignore-scripts

COPY . .

RUN npm run test --workspace=api



FROM node:26.9 AS build-stage

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app .

RUN npm run build --workspace=api


FROM node:26.9

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY apps/workers/package*.json ./apps/workers/

RUN npm ci --omit=dev --ignore-scripts

COPY --from=build-stage /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=build-stage /usr/src/app/apps/api/src/shared/infrastructure/database/migrations ./apps/api/src/shared/infrastructure/database/migrations

CMD [ "npm", "run", "start:prod", "--workspace=api"]
