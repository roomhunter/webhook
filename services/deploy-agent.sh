#!/bin/bash

if [ ! -d /srv/web ]; then
    mkdir /srv/web
fi

cd /srv/web

# overwrite if exists already
svn export --force https://github.com/roomhunter/web-admin/trunk/dist agent
