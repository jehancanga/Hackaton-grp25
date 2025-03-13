FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install axios && npm install -g nodemon

RUN mkdir -p uploads

COPY . .

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]