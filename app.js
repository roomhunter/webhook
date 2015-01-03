var child_process = require('child_process');
var fs = require('fs');
var hook = require('./github-webhook.js')({
    port: 3333,
    path: '/github',
    logger: { log: console.log, error: console.error }
});

// listen to push on github on branch master
hook.on('push:roomhunter-homepage', function (payload) {
    child_process.execFile('./deploy-homepage.sh', function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
    });
});

hook.on('push:roomhunter-webapp', function (payload) {

});

hook.on('push:server', function (payload) {

});

hook.on('push:nginx-config', function (payload) {
    child_process.execFile('./update-nginx.sh', function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
    });
});


hook.listen();
