#!/bin/bash

cd /etc

# overwrite if exists already
svn export --username to0 --force https://github.com/roomhunter/nginx-config/trunk nginx

nginx -s reload
