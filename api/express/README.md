# ExpressJS TypeScript REST API + SPA

Scaffold for ExpressJS REST backend w/ TypeScript for better tooling and ORM support.

## What's Working

- [ExpressJS](https://expressjs.com) REST
- [TypeORM](https://typeorm.io) 
- [PassportJS](https://www.passportjs.org)
    - With Google Authentication
    - With Microsoft Authentication
- [KafkaJS](https://kafka.js.org)
    - With Schema Registry Support
    - With AVRO Serde 

## Setup

1. Copy the `env.sample` to `.env` and fill in the required secrets.
2. Install deps `npm install`
3. Run the application:

`npm run dev`

> Make sure the `database-stack`, `kafka-stack` and `flink-stack` relevant components are running.


