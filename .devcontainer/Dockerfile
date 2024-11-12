FROM mcr.microsoft.com/devcontainers/dotnet:1-8.0-bookworm
# dotnet image

# install Node.js 222
RUN apt install curl wget -y 
RUN curl -sL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh

RUN apt install nodejs -y 
RUN npm install -g @angular/cli

# install bun
RUN curl -fsSL https://bun.sh/install | bash

# install go
RUN wget https://go.dev/dl/go1.23.3.linux-amd64.tar.gz 
RUN sudo tar -C /usr/local -xzf go1.23.3.linux-amd64.tar.gz
RUN "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile

RUN apt-get install redis-tools

# install java
RUN apt install openjdk-17-jdk -y
RUN apt install maven -y
 