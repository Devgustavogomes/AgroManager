FROM node:22-slim as build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

USER node

CMD [ "npm", "run" "build" ]



FROM node:22-slim as prod-stage

WORKDIR /src/usr/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build-stage /usr/src/app/dist ./dist

USER node

CMD ["npm", "run", "start:prod"]