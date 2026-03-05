FROM node:25.8

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
