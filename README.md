### Auto-deployment to staging server on each PUSH

When events(push, release etc.) happened in repositories in GitHub, it sends a POST request to a url. which is listened by our webhook handler.

This webhook handler is listening the requests, to execute a re-deployment script. That's it.

```node
hook.on('push:roomhunter-homepage', function (payload) {
    child_process.execFile('./deploy-homepage.sh', function(err, stdout, stderr) {
        if (err) {
            //...
        }
    });
});

```
