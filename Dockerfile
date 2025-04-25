# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir com nginx
FROM nginx:alpine

# Remove a configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build do React para a pasta pública do nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE é opcional, mas recomendado
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
