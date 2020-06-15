#!/bin/bash
if [ "$1" == "dev" ]; then
  git checkout develop \
  && git pull \
  && npm install \
  && npm run-script minify \
  && npm start
fi

if [ "$1" == "prod" ]; then
  git reset --hard \
  && git checkout master \
  && git pull \
  && npm install \
  && npm run-script minify \
  && pm2 startOrReload ecosystem.config.js --only nome-cliente \
  && rm public/js/iframe.js public/js/watson.js public/css/watson.css public/css/watson_carousel.css
fi
