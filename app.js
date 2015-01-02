var githubHandler = require('github-webhook.js')({
    port: 3333,
    path: '/github'
});


// listen to push on github on branch master
github.on('push:roomhunter-homepage', function (data) {
    console.log(data);
});

github.listen();
