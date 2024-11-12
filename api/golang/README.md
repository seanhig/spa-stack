# Go REST API + SPA

A GoLang implementation... 

Scaffold for [GoLang](https://go.dev) REST backend.  It's insanely fast.

## What's Working

- [Gin](https://gin-gonic.com) REST
- [GORM](https://gorm.io/) ORM to MySQL and Postgres
- [GOTH](https://github.com/markbates/goth)
    - With Google Provider
    - With Microsoft Provider
- [Go Kafka](github.com/confluentinc/confluent-kafka-go/v2/kafka)
    - With Schema Registry Support
    - With AVRO Serde 

## Setup

1. Copy the `env.sample` to `.env` and fill in the required secrets.
2. Install deps `go get .` or `go mod download`
2. Run the application:

`go run .`

> Make sure the `database-stack`, `kafka-stack` and `flink-stack` relevant components are running.


## Docker Build
Since we are working in a `.devcontainer` it would be troublesome (but not impossible) to build and run our docker containers DnD style.  Better to have them running alongside the `.devcontainer` in our Docker Desktop.

__In `.devcontainer`__

1. Run `./build-spa.sh angular` from the project directory.  This will build and place the `angular` SPA into the `public` folder.

__On Host__

2. optionally execute `./build.sh` to verify the build. `docker compose` will do this if the image does not exist.
3. `docker compose up -d`

This will launch using the existing `.env` settings.

