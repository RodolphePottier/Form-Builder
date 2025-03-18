FROM node:22.9.0

WORKDIR /app

COPY frontend/package*.json ./
COPY frontend/ .
COPY .env /app/.env

RUN apt-get update && apt-get upgrade -y && apt-get install -y
RUN npm install -g npm@latest
RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "npm" , "run" , "start" ]