FROM node:26.7

WORKDIR /usr/src/app

COPY package*.json ./
COPY web/package*.json ./web/

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "dev", "--workspace=web"]
