LOCAL=${PWD}
TARGETDEVDIR=src/public
TARGETDIR=dist/public
rm -rf ../../.dist/app
cd ../../ui/$1 
npm install
npm run build
cd $LOCAL
rm -r ./$TARGETDEVDIR/*
rm -r ./$TARGETDIR/*
[ ! -d $TARGETDEVDIR ] && mkdir ./$TARGETDEVDIR
[ ! -d $TARGETDIR ] && mkdir ./$TARGETDIR
cp -ar ../../.dist/app/browser/* ./$TARGETDEVDIR/
cp -ar ../../.dist/app/browser/* ./$TARGETDIR/
echo "refreshed distribution directory ${TARGETDIR}, dev: ${TARGETDEVDIR}"
