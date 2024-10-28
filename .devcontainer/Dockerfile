FROM mcr.microsoft.com/devcontainers/dotnet:1-8.0-bookworm

RUN apt install curl -y 
RUN curl -sL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh

RUN apt install nodejs -y 
RUN npm install -g @angular/cli

RUN apt install openjdk-17-jdk -y
RUN apt install maven -y
 