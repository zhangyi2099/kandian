#!/usr/bin/env node

process.env.TZ = require('config').Config.timezone;
var http = require('http');
var interval = require('config').Config.interval;
var app = require('./app');
var crawlerNeteaseHeadLine = require('./netease').crawlerHeadLine;
var crawlerNeteaseTags = require('./netease').crawlerTags;
var crawlerSohuHeadLine = require('./sohu').crawlerHeadLine;
var crawlerSohuTags = require('./sohu').crawlerTags;
var crawlerSinaHeadLine = require('./sina').crawlerHeadLine;
var crawlerQqHeadLine = require('./qq').crawlerHeadLine;
var crawlerIfengHeadLine = require('./ifeng').crawlerHeadLine;

http.createServer(app).listen(app.get('port'), function(){
  setInterval(crawlerNeteaseHeadLine, interval);
  setInterval(crawlerNeteaseTags, interval*2);
  setInterval(crawlerSohuHeadLine, interval);
  setInterval(crawlerSohuTags, interval*2);
  setInterval(crawlerSinaHeadLine, interval);
  setInterval(crawlerQqHeadLine, interval);
  setInterval(crawlerIfengHeadLine, interval);
  console.log("Express Start server.js at http://127.0.0.1:" + app.get('port') + "  " + new Date());
});