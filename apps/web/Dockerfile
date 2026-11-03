FROM node:26.9

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "dev", "--workspace=web"]
