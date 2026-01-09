FROM node:25.2 AS test-stage

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --include=dev

COPY . .

RUN npm run test



FROM node:25.2 AS build-stage

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --omit=dev

RUN npm run build



FROM node:25.2

COPY --from=build-stage /usr/src/app/dist /usr/src/app/dist

CMD [ "npm", "run", "start:prod" ]

