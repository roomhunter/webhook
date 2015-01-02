var hook = require('./github-webhook.js')({
    port: 3333,
    path: '/github',
    logger: { log: console.log, error: console.error }
});


// listen to push on github on branch master
hook.on('push:roomhunter-homepage', function (data) {
    execFile('./deploy-homepage.sh', function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.error('stderr: ' + stderr);
        if (error !== null) {
            console.error('exec error: ' + error);
        }
    });
});

hook.on('push:roomhunter-webapp', function (data) {

});

hook.on('push:server', function (data) {

});

hook.listen();
