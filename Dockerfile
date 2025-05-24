FROM node:latest
WORKDIR /src/app

COPY package*.json .
RUN npm install -g @angular/cli
RUN npm ci
COPY . .

EXPOSE 4200
CMD ["npm", "run", "start:prod"]

