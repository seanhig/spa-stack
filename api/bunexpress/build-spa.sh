LOCAL=${PWD}
TARGETDIR=public
rm -rf ../../.dist/app
cd ../../ui/$1 
npm install
npm run build
cd $LOCAL
rm -r ./$TARGETDIR/*
[ ! -d $TARGETDIR ] && mkdir ./$TARGETDIR
cp -ar ../../.dist/app/browser/* ./$TARGETDIR/
echo "refreshed distribution directory ${TARGETDIR}"
