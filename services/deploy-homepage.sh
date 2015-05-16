#!/bin/bash

osscmd="python /srv/webhook/services/oss_python_sdk_20150413/osscmd"

if [ ! -d /srv/web ]; then
    mkdir /srv/web
fi

cd /srv/web

if [ ! -d homepage ]; then
    mkdir homepage
fi
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
if [ "$server" == "ec2" ]; then
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=text/css styles/ s3://roomhunter-static/styles/
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=application/javascript scripts/ s3://roomhunter-static/scripts/
s3cmd sync --acl-public --skip-existing --no-delete-removed fonts/ s3://roomhunter-static/fonts/
s3cmd sync --acl-public --skip-existing --no-delete-removed images/ s3://roomhunter-static/images/

# configure osscmd first to use
# set up access id and key to environment variable
# osscmd='python /srv/webhook/services/oss_python_sdk_20150413/osscmd'
# osscmd config --id= --key=
else
$osscmd uploadfromdir styles oss://roomhunter-static/styles
$osscmd uploadfromdir scripts oss://roomhunter-static/scripts
$osscmd uploadfromdir images oss://roomhunter-static/images
fi
FILES=`find ./fonts -type f -exec basename {} \;`
for f in $FILES; do
    $osscmd put fonts/$f oss://roomhunter-static/fonts/$f --headers="Access-Control-Allow-Origin:*"
done
