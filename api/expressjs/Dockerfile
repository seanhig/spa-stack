FROM node:lts-bullseye-slim

RUN mkdir /app
COPY src /app/src
COPY public /app/public
COPY index.js /app
COPY package.json /app 
COPY package-lock.json /app

WORKDIR /app
RUN npm install

ENV ENVIRONMENT=production

CMD [ "node", "index.js" ]




