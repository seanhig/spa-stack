FROM oven/bun:latest

WORKDIR /app

ENV SPASTACK_ENV=production
#ENV NODE_ENV=production to turn off logging

COPY index.ts /app
COPY tsconfig.json /app
COPY package.json /app
COPY public /app/public
COPY src /app/src 

RUN cd /app && bun install
RUN bun pm untrusted

USER bun
EXPOSE 8090/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]







