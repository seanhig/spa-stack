# SPA Stack
A collection of interoperable `frontends` and `backends` for delivering dockerized SPA web applications.

THe `backend` REST API frameworks chosen are `C# .NET Core 8.0 WebApi`, `SpringBoot REST` and `ExpressJS`.

The `frontend` SPA frameworks chosen are `Angular`, `React Typescript` and `VanillaJS`, for contrast and variety.

The development environment comes with the codebase in the form of a `devcontainer`, with an out-of-the-box _everything you need to start coding_ approach. Batteries included.

When using `VSCode` as the IDE, the `devcontainer` will build a development environment with all the required dependencies and SDK/JDKs for working with the projects in this `spa-stack`.  

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 
- [git](https://git-scm.com)
- [Visual Studio Code](https://code.visualstudio.com)

## The REST API Backends
All located in the [api](api) folder.

1. [C# .NET Core 8.0 WebApi](api/WebAPI/)
2. [Spring Boot REST+](api/springboot/)
2. [ExpressJS](api/express/)

Objective is to implement the same backend API, such that the front-ends can interchange backends, and visa versa. 

> As of this writing the `Angular + WebAPI` is mostly functional and serves as the baseline and initial implementation.

All `backends` are hosted on `https://localhost:8090`.

## The SPA Frontends
All located in the [ui](ui) folder.

1. [Angular 18](ui/angular/)
2. [React TS](ui/react/)
3. [VanillaJS](ui/vanilla/)

Each of these will implement a slightly different UI approach to the standardized API backend.

All `frontends` are hosted on `https://localhost:4200`.

## Context and Concept: The General Store
The following diagram outlines the broader concept implemented across the three projects of: [database-stack](https://github.com/seanhig/database-stack), [flink-stack](https://github.com/seanhig/flink-stack) and [spa-stack](https://github.com/seanhig/spa-stack).

### The General Store Workflow
![The General Store Overview](docs/Lake-spa-stack-overview.png)

Started as a simple `flink` example of change data capture and stream processing, [Streaming ETL to Iceberg](), and was then used as the context to incorporate and explore other components involved:

- [Streaming ETL to Iceberg](https://github.com/seanhig/flink-stack/tree/main/examples/streaming-etl-to-iceberg) demonstrates using `Flink SQL` and `Flink CDC Sources and Sinks` to prototype and execute `Flink Jobs` for moving, curating and analyzing data in real time.  Flink CDC turns traditional RDBMS into an activity stream.

- [Streaming ETL Java](https://github.com/seanhig/flink-stack/tree/main/examples/streaming-etl-java) turns the `Flink SQL` scripts into a deployable `Java Jar`.

- [Streaming ETL K8s](https://github.com/seanhig/flink-stack/tree/main/examples/k8s) uses the `Flink Kubernetes Operator` to create a `Flink Session Cluster`, into which the `Java Job Jars` can be deployed directly via `Kubernetes YAML` definitions.

- [Web Order Processor](https://github.com/seanhig/flink-stack/tree/main/examples/kafka/weborder-processor) uses `SpringBoot Kafka and JPA` app to read `Apache AVRO formatted Web Order messages` from an `Apacke Kafka` topic and process them into the `Orders` and `Shipments` tables of the example.

- [Web Order Generator](https://github.com/seanhig/flink-stack/tree/main/examples/kafka/webordergen) is a `SpringBoot` application that generates incoming Web Orders at a specified frequency to simulate incoming web order transactions for Flink analysis and processing.

- [SPA Stack - The General Store](https://github.com/seanhig/spa-stack) provides a simple web front end that can read from the source RDBMS systems, and submit new Web Orders to `Apache Kafka`, in a common CQRS style.

The [spa-stack]() provides the customer facing store front web application. The `flink-stack`, and the components described above, handle the `back office` aspects of the system using stream processing and change data capture to enable near real-time data lakes from the incoming order information.  The  `web order generator` can be used to simulate high volume order intake, which is useful in exploring `Flink queries` operating on incoming streams of data.

__The General Store__ end-to-end practically demonstrates the following concepts:

- OAuth2 OpenID Connect Authentication w/ SPA Front End
- RDBMS Persistence via declarative ORM in the API layer
- Decoupling high volume intake sources using Apache Kafka and messaging.
- The use of AVRO Serde for intake, and Iceberg Serde for upsertable data lake
- Change Data Capture streaming and stream processing
- Apache Flink's ability to execute SQL JOIN and aggregation semantics cross-system
- Apache Flink / Iceberg integration for near real-time Serde based Data Lake updates
- Containerization and Orchestration

## Setup

The following stacks are recommended for attempting to run the `spa-stack`:

1. [database-stack](https://github.com/seanhig/database-stack) which also provides the `kafka-stack`.
2. [flink-stack](https://github.com/seanhig/flink-stack) which includes the `streaming etl` general store example shown in the diagram.

Everything runs in `Docker Desktop` and `Docker Kubernetes`.  

The entire collection of `stacks` operates using less then `32GB RAM` and can be run on a laptop.

To setup a `spa-stack`, see the API documentation:

1. [WebAPI](api/WebAPI/README.md) 
2. [SpringBoot](api/springboot/) - TODO
3. [ExpressJS](api/express) - TODO

The `Angular` + `.NET Core WebApi` combination forms the initial implementation and serves as the baseline.  

Setup and configuration is described in the API READMEs, which also deal with `Docker containerization` and prep for `Kubernetes` deployments.  See the [.NET Core WebApi](api/WebAPI/) implementation for more details.

## Workflow

During `development` the `frontend` SPA engine (ng or vite) is started first.  The API backend then proxies to the SPA front end (on `:4200`).  The backend implements the `HTTPS` required for `OAuth2` development and testing, and so the `backend URL` is used for most development. 

For `production`, the `backends` host the `frontend SPA` as static HTML, and are built as a single deployable container. This model is well suited to `App Service` container deployments, as well as `Kubernetes`. 

#### Initial UI Creation Notes
```
cd ui
ng new angular
npm create vite@latest react -- --template react-ts
npm create vite@latest vanilla -- --template vanilla
```

The `Vite` projects and `Angular` are all configured to build to the same location: `.dist/app/browser`, which is then picked up for deployment by the `WebAPI` and `springboot` packages.  ExpressJS is simply configured to static host.

#### Initial API Creation

This is covered in the respective project READMEs.

