# Use a imagem do Node como base
FROM node:latest as build-stage

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos necessários e instala as dependências
COPY . .
RUN npm install
RUN npm run build

# Configura um servidor HTTP simples para servir o aplicativo Angular
FROM nginx:alpine
COPY --from=build-stage /app/dist/frontend /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
