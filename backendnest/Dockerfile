FROM node:25.3

WORKDIR /usr/src/app 

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
