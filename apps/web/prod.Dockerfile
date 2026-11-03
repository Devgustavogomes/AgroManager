FROM node:26.9 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm ci

COPY . .

RUN npm run build --workspace=web



FROM nginx:alpine

COPY --from=build-stage /usr/src/app/apps/web/dist /usr/share/nginx/html

EXPOSE 80


