FROM oven/bun:latest

WORKDIR /app

ENV SPASTACK_ENV=production

COPY index.ts /app
COPY tsconfig.json /app
COPY package.json /app
COPY public /app/public
COPY src /app/src 

RUN cd /app && bun install
RUN bun pm untrusted

# pre-prod
#RUN bun add -g pino-pretty 

USER bun
EXPOSE 8090/tcp
# prod
ENTRYPOINT [ "bun", "run", "index.ts" ]
# pre-prod
#ENTRYPOINT [ "bun", "run", "index.ts", " | ", "pino-pretty" ]







