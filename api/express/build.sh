# 1. `npm run build` within .devcontinaer, 
# 2. `build-spa.sh <spaname>` within .devcontainer 
# 3. then run this build script outside .devcontainer to build docker all-in-one container

docker build . -t idstudios/spa-stack-express-angular:1.0.0

# 4. 'docker compose up -d' will run the container using the local dev .env settings
