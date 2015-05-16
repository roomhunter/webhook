#!/bin/bash

osscmd="python /srv/webhook/services/oss_python_sdk_20150413/osscmd"

if [ ! -d /srv/web ]; then
    mkdir /srv/web
fi

cd /srv/web
if [ ! -d mainapp ]; then
    mkdir mainapp
fi
# overwrite if exists already
# svn export --force https://github.com/roomhunter/web-mainapp/trunk/dist mainapp

# overwrite if exists already
rm -rf mainapp
svn export --force https://github.com/roomhunter/web-mainapp/trunk/dist mainapp

# upload to CDN

cd mainapp
# need to install s3cmd first to use
# set up access id and key to environment variable
# apt-get install python-setuptools
# cd s3cmd-1.5.2
# python setup.py install
if [ "$server" == "ec2" ]; then
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=text/css styles/ s3://roomhunter-static/app/styles/
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=application/javascript scripts/ s3://roomhunter-static/app/scripts/
s3cmd sync --acl-public --skip-existing --no-delete-removed fonts/ s3://roomhunter-static/app/fonts/
s3cmd sync --acl-public --skip-existing --no-delete-removed images/ s3://roomhunter-static/app/images/
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=text/html apartment_components/ s3://roomhunter-static/app/apartment_components/
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=text/html order_components/ s3://roomhunter-static/app/order_components/
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=text/html shared_components/ s3://roomhunter-static/app/shared_components/
s3cmd sync --acl-public --skip-existing --no-delete-removed --mime-type=text/html user_components/ s3://roomhunter-static/app/user_components/

# configure osscmd first to use
# set up access id and key to environment variable
# osscmd='python /srv/webhook/services/oss_python_sdk_20150413/osscmd'
# osscmd config --id= --key=
else
$osscmd uploadfromdir styles oss://roomhunter-static/app/styles
$osscmd uploadfromdir scripts oss://roomhunter-static/app/scripts
$osscmd uploadfromdir images oss://roomhunter-static/app/images
$osscmd uploadfromdir apartment_components oss://roomhunter-static/app/apartment_components
$osscmd uploadfromdir order_components oss://roomhunter-static/app/order_components
$osscmd uploadfromdir shared_components oss://roomhunter-static/app/shared_components
$osscmd uploadfromdir user_components oss://roomhunter-static/app/user_components
fi

FILES=`find ./fonts -type f -exec basename {} \;`
for f in $FILES; do
    $osscmd put fonts/$f oss://roomhunter-static/app/fonts/$f --headers="Access-Control-Allow-Origin:*"
done
