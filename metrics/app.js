const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const winston = require('winston');
require('../common/startup/main')();

const indexRouter = require('./router');

const app = express();
const cors = require('cors');
const {cors_delegate} = require("../common/helpers/cors");
app.use(cors(cors_delegate))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error =( req.app.get('env').toLowerCase() === 'development' || req.app.get('env').toLowerCase() === 'local') ? err : {};

  // render the error page
  return res.status(err.status || 500).json({});
});

const {start_consumming} = require('./helpers/consumer');

start_consumming();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Server listening on port ${port}...`));

module.exports = server;
