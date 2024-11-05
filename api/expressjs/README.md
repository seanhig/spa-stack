# ExpressJS REST API + SPA

Scaffold for ExpressJS REST backend using only Javascript and without the overhead of ORM.

## What's Working

- [ExpressJS](https://expressjs.com) REST
- [Postgres](https://node-postgres.com) and [MySQL](https://github.com/mysqljs/mysql)
- [PassportJS](https://www.passportjs.org)
    - With Google Authentication
    - With Microsoft Authentication
- [KafkaJS](https://kafka.js.org)
    - With Schema Registry Support
    - With AVRO Serde 

## Setup

1. Copy the `env.sample` to `.env` and fill in the required secrets.
2. Run the application:

`npm start`

> Make sure the `database-stack`, `kafka-stack` and `flink-stack` relevant components are running.

> There is no annoying build process without TypeScript, and the ORM systems may be more trouble then they are worth.  I think this version is the most elegant.


## Docker Build
Since we are working in a `.devcontainer` it would be troublesome (but not impossible) to build and run our docker containers DnD style.  Better to have them running alongside the `.devcontainer` in our Docker Desktop.

__In `.devcontainer`__

1. Run `./build-spa.sh angular` from the project directory.  This will build and place the `angular` SPA into the `public` folder.

__On Host__

3. `docker compose up -d`

This will build the docker container and launch it via `docker compose` using the existing `.env` settings.


