# 1. `build-spa.sh <spaname>` within .devcontainer 

docker build . -t idstudios/spa-stack-go-angular:1.0.0  #--progress=plain

# 2. 'docker compose up -d' outside .devcontainer will run the container using the local dev .env settings
