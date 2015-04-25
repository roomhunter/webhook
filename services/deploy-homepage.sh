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
s3cmd sync --acl-public —skip-existing --no-delete-removed --acl-public --mime-type=text/css styles/ s3://roomhunter-static/styles/
s3cmd sync --acl-public —skip-existing --no-delete-removed --acl-public --mime-type=application/javascript scripts/ s3://roomhunter-static/scripts/
s3cmd sync --acl-public —skip-existing --no-delete-removed --acl-public fonts/ s3://roomhunter-static/fonts/
s3cmd sync --acl-public —skip-existing --no-delete-removed images/ s3://roomhunter-static/images/

# configure osscmd first to use
# set up access id and key to environment variable
# osscmd='python /srv/webhook/services/oss_python_sdk_20150413/osscmd'
# osscmd config --id= --key=
$osscmd uploadfromdir styles oss://roomhunter-static/styles
$osscmd uploadfromdir scripts oss://roomhunter-static/scripts
$osscmd uploadfromdir images oss://roomhunter-static/images
FILES=`find ./fonts -type f -exec basename {} \;`
for f in $FILES; do
    $osscmd put fonts/$f oss://roomhunter-static/fonts/$f --headers="Access-Control-Allow-Origin:*"
done

