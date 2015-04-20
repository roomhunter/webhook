#!/bin/bash

cd /srv/

# overwrite if exists already
svn export --force https://github.com/roomhunter/server/trunk server

cd server

npm install

if ! forever restart index.js ; then
    export NODE_ENV=production
    forever start -a --uid "server" -o /srv/logs/server/out.log -e /srv/logs/server/err.log index.js
fi
