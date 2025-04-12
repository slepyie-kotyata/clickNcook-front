FROM node:20
WORKDIR /src/app

COPY package*.json .
RUN npm install -g @angular/cli
RUN npm ci
COPY . .

EXPOSE 4200
CMD ["ng","serve","--host", "0.0.0.0"]
