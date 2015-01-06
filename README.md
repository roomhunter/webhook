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
