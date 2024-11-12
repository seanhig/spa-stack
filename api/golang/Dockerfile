# Build the application from source
FROM golang:1.23 AS build-stage
WORKDIR /app
COPY . /app
RUN go mod download
RUN go build -o spa-stack-go-api

# Deploy the application binary into a lean image
FROM debian:stable-slim 
WORKDIR /
COPY --from=build-stage /app/spa-stack-go-api .
COPY --from=build-stage /app/public/ /public
RUN ls -al 
RUN ls -al ./public

EXPOSE 8090
CMD ["./spa-stack-go-api"]
#ENTRYPOINT ["/spa-stack-go-api"]