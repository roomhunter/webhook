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
# apt-get install python-setuptools
# cd s3cmd-1.5.2
# python setup.py install
s3cmd put -r --acl-public styles/ s3://roomhunter-static/styles/
s3cmd put -r --acl-public scripts/ s3://roomhunter-static/scripts/
s3cmd put -r --acl-public font/ s3://roomhunter-static/font/

# configure osscmd first to use
# alias osscmd='python /srv/webhook/services/oss_python_sdk_20150413/osscmd'
osscmd uploadfromdir styles oss://roomhunter-static/styles
osscmd uploadfromdir scripts oss://roomhunter-static/scripts
osscmd put font/rh-icons.eot oss://roomhunter-static/font/rh-icons.eot --headers="Access-Control-Allow-Origin:*"
osscmd put font/rh-icons.svg oss://roomhunter-static/font/rh-icons.svg --headers="Access-Control-Allow-Origin:*"
osscmd put font/rh-icons.ttf oss://roomhunter-static/font/rh-icons.ttf --headers="Access-Control-Allow-Origin:*"
osscmd put font/rh-icons.woff oss://roomhunter-static/font/rh-icons.woff --headers="Access-Control-Allow-Origin:*"

