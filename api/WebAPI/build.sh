# copy the development cert for packaging and use locally
cp ../../.devcontainer/devcert.pfx .   
docker build . -t idstudios/spa-stack-webapi-angular:1.0.0
