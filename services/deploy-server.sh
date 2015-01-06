cd /srv/

# overwrite if exists already
svn export --force https://github.com/roomhunter/server/trunk server

cd server

if ! forever restart index.js ; then
    forever start -a --uid "server" -o /srv/logs/server/out.log -e /srv/logs/server/err.log index.js
fi