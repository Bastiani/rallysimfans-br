# Stage 1: Build da aplicação React + Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte e buildar
COPY . .
RUN npm run build

# Stage 2: Configuração do Nginx com SSL
FROM nginx:alpine

# Instalar dependências necessárias para SSL
RUN apk add --no-cache openssl

# Criar diretório para certificados SSL
RUN mkdir -p /etc/nginx/ssl

# Remover configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos de build
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Garantir permissões corretas
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor portas HTTP e HTTPS
EXPOSE 80
EXPOSE 443

# Script de inicialização para gerar certificados SSL e iniciar Nginx
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
