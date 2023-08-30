# build
FROM node:18-slim as build

WORKDIR app

COPY package.json .
COPY package-lock.json .

RUN npm install && npm install -g grunt-cli

# run
FROM node:18-slim as run

WORKDIR app

COPY package.json .
COPY server server

ENV PORT=8080

RUN npm install --production

CMD [ "npm", "start" ]
