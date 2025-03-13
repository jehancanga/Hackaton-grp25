FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install axios && npm install -g nodemon

RUN mkdir -p uploads

COPY . .

EXPOSE 3000

CMD ["nodemon", "server.js"]