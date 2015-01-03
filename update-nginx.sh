cd /etc

# overwrite if exists already
svn export --force https://github.com/roomhunter/nginx-config/trunk nginx

nginx -s reload
