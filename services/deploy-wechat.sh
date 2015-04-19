cd /srv/

cd wechat-server/wechat-server

npm update

if ! forever restart app.js ; then
    export NODE_ENV=production
    forever start -a --uid "wechat-server" -o /srv/logs/wechat-server/out.log -e /srv/logs/wechat-server/err.log app.js
fi
