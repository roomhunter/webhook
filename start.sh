if [ ! -d /srv/logs ]; then
    mkdir /srv/logs
fi

if [ ! -d /srv/logs/webhook ]; then
    mkdir /srv/logs/webhook
    touch /srv/logs/webhook/out.log
    touch /srv/logs/webhook/err.log
fi

forever start -a -o --uid "webhook" /srv/logs/webhook/out.log -e /srv/logs/webhook/err.log hook.js
