# ---------- Build Angular ----------
FROM node:20-alpine AS build

# переменные среды (Докплой их подставит автоматом)
ENV NG_APP_API=""
ENV NG_APP_WEBSOCKET_API=""

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

# Проверка что переменные пришли
RUN echo "=== ENV CHECK ===" && \
    echo "NG_APP_API=$NG_APP_API" && \
    echo "NG_APP_WEBSOCKET_API=$NG_APP_WEBSOCKET_API" && \
    printenv | grep NG_APP || echo "ENV не найдены!"

# Генерация конфигурации и сборка
RUN echo "NG_APP_API=$NG_APP_API" > .env && \
    echo "NG_APP_WEBSOCKET_API=$NG_APP_WEBSOCKET_API" >> .env && \
    export $(cat .env | xargs) && \
    npm run build

# ---------- NGINX ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
