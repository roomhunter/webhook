var child_process = require('child_process');
var mailgun = require('mailgun-js')({apiKey: 'key-b12de0859c16bb24cad2299d68129299', domain: 'roomhunter.us'});
var fs = require('fs');
var s3 = require('s3');
var s3Client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  }
});
var hook = require('./github-webhook.js')({
    port: 5000,
    path: '/github',
    logger: { log: console.log, error: console.error }
});

// var mailgun = new Mailgun;
var mailTemplate = fs.readFileSync('deploy-confirm.html', 'utf-8');
var mailContent = {
    //Specify email data
    from: "roomhunter <support@roomhunter.us>",
    //The email to contact
    to:'roomhunterteam@googlegroups.com',
    //Subject and text data
    subject: 'Code Deployed!',
    html: ''
};
var realnameMap = {
    'to0': 'Yuannan Cai',
    'Staniel': 'Lixin Yao',
    'si-yao': 'Siyao Li',
    'j3y2z1': '鸡总君,请多多指教',
    'TerrenceRush': 'Xinyue Li'
};
function syncFilesToCDN(localRoot, success) {
  var callback = success || function(){};

  var params = {
    localDir: localRoot + "/styles",
    deleteRemoved: false,
    s3Params: {
      Bucket: "roomhunter-static",
      Prefix: "styles/"
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    }
  };
  var stylesUploader = s3Client.uploadDir(params);
  stylesUploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });
  stylesUploader.on('end', function() {
    params.localDir = localRoot + '/scripts';
    params.s3Params.Prefix = localRoot + 'scripts/';
    var scriptsUploader = s3Client.uploadDir(params);
    scriptsUploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
    });
    scriptsUploader.on('end', callback);
  });
}

function sendConfirmation(payload) {
    var repo = payload.repository['full_name'];
    var commit = payload.commits[0];
    var message = commit.message;
    var url = commit.url;
    var githubName = commit.author.name;
    var githubUserName = commit.author.username
    var realName = realnameMap[githubName] || realnameMap[githubUserName] || githubUserName;

    var confirmMail = mailTemplate.replace('{{NAME}}', realName).replace('{{COMMIT}}', message)
    .replace('{{REPO}}', repo).replace('{{REPO_URL}}', url).replace('{{RESULT}}', 'successfully');
    mailContent.html = confirmMail;
    mailgun.messages().send(mailContent, function (err, body) {
        if (err) {
            console.error(err);
        }
        else {
            console.log('confirmation sent');
        }
    });
}
function sendHonor(payload) {
    var repo = payload.repository['full_name'];
    var commit = payload.commits[0];
    var message = commit.message;
    var url = commit.url;
    var githubName = commit.author.name;
    var githubUserName = commit.author.username
    var realName = realnameMap[githubName] || realnameMap[githubUserName] || githubUserName;

    var confirmMail = mailTemplate.replace('{{NAME}}', realName).replace('{{COMMIT}}', message)
    .replace('{{REPO}}', repo).replace('{{REPO_URL}}', url).replace('{{RESULT}}', 'ready be');
    mailContent.html = confirmMail;
    mailgun.messages().send(mailContent, function (err, body) {
        if (err) {
            console.error(err);
        }
        else {
            console.log('confirmation sent');
        }
    });
}

// listen to push on github on branch master

hook.on('push:webhook', function (payload) {
    child_process.execFile('./services/reload-self.sh', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
        }
    });
});

hook.on('push:web-homepage', function (payload) {
    child_process.execFile('./services/deploy-homepage.sh', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        else {
            syncFilesToCDN('/srv/web/homepage', function(){
              sendConfirmation(payload);
            });
        }
    });
});

hook.on('push:web-desktop', function (payload) {
    child_process.execFile('./services/deploy-mainapp.sh', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        sendConfirmation(payload);
    });
});

hook.on('push:web-mobile', function (payload) {
  child_process.execFile('./services/deploy-mobileapp.sh', function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    sendConfirmation(payload);
  });
});

hook.on('push:server', function (payload) {
  child_process.execFile('./services/deploy-server.sh', function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    sendConfirmation(payload);
  });
});

hook.on('push:nginx-config', function (payload) {

    child_process.execFile('./services/update-nginx.sh', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        sendConfirmation(payload);
    });
});
hook.on('push:wechat-server', function (payload) {

    child_process.execFile('./services/deploy-wechat.sh', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        sendConfirmation(payload);
    });
});

hook.on('push:match-recommend', function (payload) {
    sendHonor(payload);
});

hook.on('push:angular-upyun', function (payload) {
    sendHonor(payload);
});
hook.on('push:angular-loading-bar', function (payload) {
    sendHonor(payload);
});
hook.on('push:databasebackup', function (payload) {
    sendHonor(payload);
});

hook.listen();
