# Build Angular
FROM node:20-alpine as build

ARG NG_APP_API
ARG NG_APP_WEBSOCKET_API

ENV NG_APP_API=$NG_APP_API
ENV NG_APP_WEBSOCKET_API=$NG_APP_WEBSOCKET_API

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

# debug — важный момент!
RUN echo "API=$NG_APP_API WS=$NG_APP_WEBSOCKET_API"

RUN npm run build

# NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
