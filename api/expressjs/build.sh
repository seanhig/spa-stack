# 1. `build-spa.sh <spaname>` within .devcontainer 
# 2. then run this build script outside .devcontainer to build docker all-in-one container

docker build . -t idstudios/spa-stack-expressjs-angular:1.0.0

# 3. 'docker compose up -d' outside .devcontainer will run the container using the local dev .env settings
