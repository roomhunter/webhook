npm install

if [ ! -d /srv/logs ]; then
    mkdir /srv/logs
fi

if [ ! -d /srv/logs/webhook ]; then
    mkdir /srv/logs/webhook
    touch /srv/logs/webhook/out.log
    touch /srv/logs/webhook/err.log
fi

cp services/roomhunter /etc/init.d/roomhunter
ln -s /etc/init.d/roomhunter /etc/rc2.d/S90roomhunter

forever start -a --uid "webhook" -o /srv/logs/webhook/out.log -e /srv/logs/webhook/err.log hook.js
