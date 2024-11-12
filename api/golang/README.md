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


## Notes

```
go mod init idstudios/gin-web-service
go install github.com/gin-gonic/gin@latest

```