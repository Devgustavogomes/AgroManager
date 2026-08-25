FROM node:26.7 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./
COPY web/package*.json ./web/

RUN npm ci

COPY . .

RUN npm run build --workspace=web



FROM nginx:alpine

COPY --from=build-stage /usr/src/app/web/dist /usr/share/nginx/html

EXPOSE 80


