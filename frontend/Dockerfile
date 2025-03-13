FROM node:18-alpine

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
COPY package-lock.json* ./
RUN npm install

# Exposer le port utilisé par le serveur de développement React
EXPOSE 80

# Démarrer le serveur de développement React
CMD ["npm", "start"]

# # Étape 1: Builder l'application React
# FROM node:18-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# COPY package-lock.json* ./

# RUN npm install

# # Copier le reste des fichiers
# COPY . .

# RUN npm run build

# # Étape 2: Servir l'application avec Nginx
# FROM nginx:alpine

# # Copier les fichiers de configuration
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]