var child_process = require('child_process');
var fs = require('fs');
var hook = require('./github-webhook.js')({
    port: 3333,
    path: '/github',
    logger: { log: console.log, error: console.error }
});

// listen to push on github on branch master

hook.on('push:webhook', function (payload) {
    child_process.execFile('./services/reload-self.sh', function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
    });
});

hook.on('push:web-homepage', function (payload) {
    child_process.execFile('./services/deploy-homepage.sh', function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
    });
});

hook.on('push:web-mainapp', function (payload) {
    child_process.execFile('./services/deploy-mainapp.sh', function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
    });
});

hook.on('push:server', function (payload) {
  child_process.execFile('./services/deploy-server.sh', function(err, stdout, stderr) {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
  });
});

hook.on('push:nginx-config', function (payload) {
    child_process.execFile('./services/update-nginx.sh', function(err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        console.log(stdout);
    });
});


hook.listen();
