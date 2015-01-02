var hook = require('./github-webhook.js')({
    port: 3333,
    path: '/github',
    logger: { log: console.log, error: console.error }
});


// listen to push on github on branch master
hook.on('push:roomhunter-homepage', function (data) {
    console.log(data);
});

hook.listen();
