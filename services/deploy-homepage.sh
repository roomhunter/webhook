#!/bin/bash

if [ ! -d /srv/web ]; then
    mkdir /srv/web
fi

cd /srv/web

# overwrite if exists already
rm -rf homepage
svn export --force https://github.com/roomhunter/web-homepage/trunk/dist homepage

# upload to CDN

cd homepage
# need to install s3cmd first to use
s3cmd put -r styles/ s3://roomhunter-static/styles/
s3cmd put -r scripts/ s3://roomhunter-static/scripts/
s3cmd put -r font/ s3://roomhunter-static/font/

# configure osscmd first to use
# alias osscmd='python /srv/webhook/services/osscmd'
osscmd uploadfromdir styles oss://roomhunter-static/styles
osscmd uploadfromdir scripts oss://roomhunter-static/scripts
osscmd put font/rh-icons.eot oss://roomhunter-static/font/rh-icons.eot --headers="Access-Control-Allow-Origin:*"
osscmd put font/rh-icons.svg oss://roomhunter-static/font/rh-icons.svg --headers="Access-Control-Allow-Origin:*"
osscmd put font/rh-icons.ttf oss://roomhunter-static/font/rh-icons.ttf --headers="Access-Control-Allow-Origin:*"
osscmd put font/rh-icons.woff oss://roomhunter-static/font/rh-icons.woff --headers="Access-Control-Allow-Origin:*"

