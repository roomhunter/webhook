#!/bin/bash

osscmd="python /srv/webhook/services/oss_python_sdk_20150413/osscmd"

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
# set up access id and key to environment variable
# apt-get install python-setuptools
# cd s3cmd-1.5.2
# python setup.py install
s3cmd put -r --acl-public --mime-type=text/css styles/ s3://roomhunter-static/styles/
s3cmd put -r --acl-public --mime-type=application/javascript scripts/ s3://roomhunter-static/scripts/
s3cmd put -r --acl-public fonts/ s3://roomhunter-static/fonts/

# configure osscmd first to use
# set up access id and key to environment variable
# osscmd='python /srv/webhook/services/oss_python_sdk_20150413/osscmd'
# osscmd config --id= --key=
$osscmd uploadfromdir styles oss://roomhunter-static/styles
$osscmd uploadfromdir scripts oss://roomhunter-static/scripts
$osscmd put fonts/roomhunter.eot oss://roomhunter-static/fonts/roomhunter.eot --headers="Access-Control-Allow-Origin:*"
$osscmd put fonts/roomhunter.svg oss://roomhunter-static/fonts/roomhunter.svg --headers="Access-Control-Allow-Origin:*"
$osscmd put fonts/roomhunter.ttf oss://roomhunter-static/fonts/roomhunter.ttf --headers="Access-Control-Allow-Origin:*"
$osscmd put fonts/roomhunter.woff oss://roomhunter-static/fonts/roomhunter.woff --headers="Access-Control-Allow-Origin:*"

