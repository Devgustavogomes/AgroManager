FROM node:26.5 AS test-stage

WORKDIR /usr/src/app


COPY package*.json ./
COPY api/package*.json ./api/
COPY infra/package*.json ./infra/
COPY commitlint.config.js ./

RUN npm ci --include=dev --ignore-scripts

COPY . .

RUN npm run build --workspace=infra

RUN npm run test --workspace=api



FROM node:26.5 AS build-stage

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app .

RUN npm run build --workspace=api


FROM node:26.5

WORKDIR /usr/src/app

COPY package*.json ./
COPY api/package*.json ./api/
COPY infra/package*.json ./infra/

RUN npm ci --omit=dev --ignore-scripts

COPY --from=build-stage /usr/src/app/api/dist ./api/dist
COPY --from=build-stage /usr/src/app/infra/dist ./infra/dist

COPY --from=build-stage /usr/src/app/infra/database/migrations ./infra/database/migrations

CMD [ "npm", "run", "start:prod", "--workspace=api"]
