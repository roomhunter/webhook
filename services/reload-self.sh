#cd /srv/webhook

git pull

#npm install

#if ! forever restart hook.js ; then
#    export NODE_ENV=production
#    forever start -a --uid "webhook" -o /srv/logs/webhook/out.log -e /srv/logs/webhook/err.log hook.js
#fi
