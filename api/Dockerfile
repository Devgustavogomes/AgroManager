FROM node:26.7

WORKDIR /usr/src/app

COPY package*.json ./
COPY api/package*.json ./api/
COPY infra/package*.json ./infra/

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev", "--workspace=api"]
