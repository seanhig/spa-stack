# Build the application from source
FROM golang:1.23 AS build-stage
#FROM golang:1.23-alpine AS build-stage
# issues building in alpine related to librdkafka
# but debian:slim and golang:1.23 base work just fine
WORKDIR /app
COPY . /app
RUN go mod download
#RUN apk add librdkafka gcc alpine-sdk
RUN go build -o spastack 

#FROM alpine AS build-sleep

# Deploy the application binary into a lean image
# debian works OOTB even with the kafka C librdkafka
FROM debian:stable-slim

# executable does not run on these, likely due to librdkafka? 
# building it with CGO is no picnic
#FROM alpine:latest 
#FROM scratch
#RUN apk add librdkafka

WORKDIR /
COPY --from=build-stage /app/spastack /bin/spastack
COPY --from=build-stage /app/public/ /public

# when running with progress=plain this will verify the files
#RUN ls -al ./bin
#RUN ls -al ./public

# we can use busybox sleep to verify the file layout in the container
#COPY --from=build-sleep /lib/ld-musl-x86_64.so.1 /lib/ld-musl-x86_64.so.1
#COPY --from=build-sleep /bin/busybox /bin/busybox

EXPOSE 8090
CMD ["/bin/spastack"]
#CMD ["/bin/busybox", "sleep", "500"]

