FROM node:26.9

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY apps/workers/package*.json ./apps/workers/

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev", "--workspace=api"]
