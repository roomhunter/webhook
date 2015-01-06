### Auto-deployment to staging server on each PUSH

When events(push, release etc.) happened in repositories in GitHub, it sends a POST request to a url.

This webhook handler is listening requests, to execute a re-deployment script. That's it.

```node
hook.on('push:web-homepage', function (payload) {
    child_process.execFile('./deploy-homepage.sh', function(err, stdout, stderr) {
        if (err) {
            //...
        }
    });
});

```

It is even able to reload itself with:

```node
hook.on('push:webhook', function (payload) {
    child_process.execFile('./services/reload-self.sh');
});
```

Once start, never stop. In start.sh, it copies one script to init.d:

```bash
cp services/roomhunter /etc/init.d/roomhunter
ln -s /etc/init.d/roomhunter /etc/rc2.d/S90roomhunter
```

And with that script, it fires all the services again:

```bash
forever stopall
cd /srv
rm -rf webhook
rm -rf server
git clone https://github.com/roomhunter/webhook.git
cd webhook
./start.sh
./services/deploy-server.sh
./services/deploy-homepage.sh
./services/update-nginx.sh
```
