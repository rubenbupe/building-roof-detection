#!/bin/bash

case "$APP" in
  FRONT)
    npm run startFront
    ;;

  API)
    cd api && FLASK_ENV=production gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 -b 0.0.0.0:3000 app:app
    ;;

  METRICS)
    npm run startMetrics
    ;;

esac
