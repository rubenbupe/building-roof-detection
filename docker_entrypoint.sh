#!/bin/bash

case "$APP" in
  FRONT)
    npm run startFront
    ;;

  API)
    cd api && python3 app.py
    ;;

esac
