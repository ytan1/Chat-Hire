#How to install locally 
git clone git@github.com:ytan1/Chat-Hire.git
switch to ssr branch 
#clean previous bundles
npm run clean
#we still need bundle.js to hydrate the content
npm run build
#run the API server
npm run server
#run the renderer server
npm run renderer
#that's it
visit localhost:4000/
done!
