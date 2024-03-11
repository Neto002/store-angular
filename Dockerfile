# Use a imagem do Node como base
FROM node:20.11.1-slim AS build-stage

# Define as variáveis de ambiente
ENV API_URL=${API_URL}
ENV OKTA_CLIENT_ID=0oafermffofR9gNdQ5d7
ENV OKTA_ISSUER=https://dev-56346414.okta.com/oauth2/default
ENV STRIPE_SECRET=pk_test_51OodOHAJv5ulnNr72csryxkwytYKUkHHmaVMAR547UfkcZI3jtnFiIymKwK7WtyLCeehGsZu6q0MpdZoS4dljFHc00642aj98z

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos necessários e instala as dependências
COPY . .
RUN npm install --save-dev @types/node
RUN npm install --save-dev
RUN npm run build

# Configura um servidor HTTP simples para servir o aplicativo Angular
FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist/frontend /usr/share/nginx/html/

# Copie os arquivos de configuração do Nginx para o diretório do contêiner
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
