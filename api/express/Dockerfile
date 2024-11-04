FROM node:lts-bullseye-slim

RUN mkdir /app
COPY ./dist /app/dist
COPY package.json /app 
COPY package-lock.json /app

WORKDIR app
RUN npm install

ENV ENVIRONMENT=production

CMD [ "node", "dist/index.js" ]




