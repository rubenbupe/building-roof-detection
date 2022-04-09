#!/bin/bash

case "$APP" in
  FRONT)
    npm run startFront
    ;;

  API)
    #cd api && FLASK_ENV=production gunicorn -b 0.0.0.0:3000 -k gevent -w 1 app:app
    cd api && FLASK_ENV=production python3 app.py  
    ;;

esac
