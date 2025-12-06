# Build Angular
FROM node:20-alpine as build

# Забираем env переменные из Dokploy (они доступны как runtime env)
ENV NG_APP_API=""
ENV NG_APP_WEBSOCKET_API=""

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

# проверим что env реально пришли
RUN printenv | grep NG_APP || echo "env-переменные не пришли!"

# перед билдом экспортируем их вручную в процесс
RUN export NG_APP_API=$NG_APP_API && \
    export NG_APP_WEBSOCKET_API=$NG_APP_WEBSOCKET_API && \
    echo "API=$NG_APP_API" && echo "WS=$NG_APP_WEBSOCKET_API" && \
    npm run build

# Production nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
