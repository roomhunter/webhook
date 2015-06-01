var child_process = require('child_process');
var mailgun = require('mailgun-js')({apiKey: 'key-b12de0859c16bb24cad2299d68129299', domain: 'roomhunter.us'});
var fs = require('fs');
var hook = require('./github-webhook.js')({
  port: 5000,
  path: '/github',
  logger: { log: console.log, error: console.error }
});

// var mailgun = new Mailgun;
var mailTemplate = fs.readFileSync('deploy-confirm.html', 'utf-8');
var mailContent = {
    //Specify email data
    from: "roomhunterCodeTeam <support@roomhunter.us>",
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
    if(process.env.server==='ec2')return;
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
    if(process.env.server==='ec2')return;
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
            sendConfirmation(payload);
        }
    });
});

hook.on('push:web-admin', function (payload) {
    child_process.execFile('./services/deploy-agent.sh', function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        else {
            sendConfirmation(payload);
        }

    });
});
hook.on('push:web-desktop', function (payload) {
  child_process.execFile('./services/deploy-mainapp.sh', function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      console.error(stderr)
      return;
    }
    else {
      console.error(stderr)
      sendConfirmation(payload);
    }

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
hook.on('push:mobile-homepage', function (payload) {
  child_process.execFile('./services/deploy-mobile-homepage.sh', function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    sendConfirmation(payload);
  });
});
hook.on('push:mkt-campaign-1', function (payload) {
  child_process.execFile('./services/deploy-mkt1.sh', function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    sendConfirmation(payload);
  });
});
hook.on('push:server', function (payload) {
  if(process.env.server==='ec2')return;
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
hook.on('push:broker', function (payload) {
  sendHonor(payload);
});
hook.on('push:angular-loading-bar', function (payload) {
    sendHonor(payload);
});
hook.on('push:databasebackup', function (payload) {
    sendHonor(payload);
});

hook.listen();
