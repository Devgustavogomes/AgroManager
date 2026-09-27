FROM node:26.7

WORKDIR /usr/src/app

COPY package*.json ./
COPY api/package*.json ./api/
COPY web/package*.json ./web/
COPY workers/package*.json ./workers/

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev", "--workspace=api"]
