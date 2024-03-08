# Use a imagem do Node como base
FROM node:20.11.1-slim AS build-stage

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos necessários e instala as dependências
COPY . .
RUN npm install
RUN npm run build

# Configura um servidor HTTP simples para servir o aplicativo Angular
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist/frontend /usr/share/nginx/html/

# Copie os arquivos de configuração do Nginx para o diretório do contêiner
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
