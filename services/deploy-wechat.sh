cd /srv/

cd wechat-server

npm update

if ! forever restart ./bin/www ; then
    export NODE_ENV=production
    forever start -a --uid "wechat-server" -o /srv/logs/wechat-server/out.log -e /srv/logs/wechat-server/err.log ./bin/www
fi
