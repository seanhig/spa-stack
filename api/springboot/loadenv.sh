[ ! -f .env ] || export $(sed 's/#.*//g' .env | xargs)