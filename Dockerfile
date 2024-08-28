FROM node:18-slim

WORKDIR app

COPY package.json .
COPY server server

ENV PORT=8080

RUN npm install --production

CMD [ "npm", "start" ]
