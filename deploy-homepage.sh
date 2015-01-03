if [ ! -d /srv/roomhunter-web ]; then
    mkdir /srv/roomhunter-web
fi

cd /srv/roomhunter-web

# overwrite if exists already
svn export --force https://github.com/roomhunter/roomhunter-homepage/trunk/dist homepage
