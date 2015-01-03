var child_process = require('child_process');
var hook = require('./github-webhook.js')({
    port: 3333,
    path: '/github',
    logger: { log: console.log, error: console.error }
});


// listen to push on github on branch master
hook.on('push:roomhunter-homepage', function (payload) {
    child_process.execFile('./deploy-homepage.sh', function(err, stdout, stderr) {
        if (err) {
            if (err.code === 'EACCES') {//permission
                child_process.exec('chmod +x deploy-homepage.sh');
                child_process.execFile('./deploy-homepage.sh');
            }
            console.log(err);
        }
        console.log(stdout);
    });
});

hook.on('push:roomhunter-webapp', function (payload) {

});

hook.on('push:server', function (payload) {

});

hook.listen();
