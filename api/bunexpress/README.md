# Bun + ExpressJS 5 REST API + SPA

Scaffold for [Bun](https://bun.sh) with TypeScript and the ExpressJS REST backend.

## What's Working

- [ExpressJS](https://expressjs.com) REST
- [TypeORM](https://typeorm.io) 
- [PassportJS](https://www.passportjs.org)
    - With Google Authentication
    - With Microsoft Authentication
- [KafkaJS](https://kafka.js.org)
    - With Schema Registry Support
    - With AVRO Serde 

## Install Bun
Install `bun` in the `.devcontainer`:

`curl -fsSL https://bun.sh/install | bash`

## Setup

1. Copy the `env.sample` to `.env` and fill in the required secrets.
2. Install deps `bun install`
2. Run the application:

`bun run index.ts`

> Make sure the `database-stack`, `kafka-stack` and `flink-stack` relevant components are running.

## Docker Build
Since we are working in a `.devcontainer` it would be troublesome (but not impossible) to build and run our docker containers DnD style.  Better to have them running alongside the `.devcontainer` in our Docker Desktop.

__In `.devcontainer`__

1. Run `./build-spa.sh angular` from the project directory.  This will build and place the `angular` SPA into the `public` folder.

__On Host__

3. `docker compose up -d`

This will build the docker container and launch it via `docker compose` using the existing `.env` settings.


