cd /srv

# Second, unzip it, if the zip file exists
if [ ! -d roomhunter-homepage ]; then
    git clone https://github.com/roomhunter/roomhunter-homepage.git

else
    cd roomhunter-homepage

    git pull
fi
