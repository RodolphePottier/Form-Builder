FROM node:22.9.0

RUN apt-get update && apt-get install -y postgresql-client
RUN npm install -g npm@latest

WORKDIR /usr/src/app

COPY backend/package*.json ./
COPY backend/wait-for-postgres.sh /wait-for-postgres.sh
COPY backend/ . 

RUN npm install
RUN npm run build
RUN chmod +x /wait-for-postgres.sh

CMD ["/wait-for-postgres.sh", "postgres", "npm", "start"]
