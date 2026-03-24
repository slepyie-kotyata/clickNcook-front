FROM node:latest AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG NG_APP_API
ENV NG_APP_API=$NG_APP_API
ARG NG_APP_WEBSOCKET_API
ENV NG_APP_WEBSOCKET_API=$NG_APP_WEBSOCKET_API

RUN echo "NG_APP_API=$NG_APP_API" > .env && \
    echo "NG_APP_WEBSOCKET_API=$NG_APP_WEBSOCKET_API" >> .env

RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/click-ncook-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
