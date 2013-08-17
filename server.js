﻿#!/usr/bin/env node

process.env.TZ = require('config').Config.timezone;
var http = require('http');
var interval = require('config').Config.interval;
var app = require('./app');
var neteaseCrawler = require('./netease').neteaseCrawler;
var sohuCrawler = require('./sohu').sohuCrawler;
var sinaCrawler = require('./sina').sinaCrawler;
var qqCrawler = require('./qq').qqCrawler;
var ifengCrawler = require('./ifeng').ifengCrawler;
var baiduCrawler = require('./baidu').baiduCrawler;
var yokaCrawler = require('./yoka').yokaCrawler;
var krCrawler = require('./kr').krCrawler;
var huxiuCrawler = require('./huxiu').huxiuCrawler;
var iheimaCrawler = require('./iheima').iheimaCrawler;
var businessvalueCrawler = require('./businessvalue').businessvalueCrawler;

http.createServer(app).listen(app.get('port'), function(){
  setInterval(neteaseCrawler, interval);
  setInterval(sohuCrawler, interval);
  setInterval(sinaCrawler, interval);
  setInterval(qqCrawler, interval);
  setInterval(ifengCrawler, interval);
  yokaCrawler();
  krCrawler();
  huxiuCrawler();
  iheimaCrawler();
  businessvalueCrawler();
  baiduCrawler();
  console.log("Express Start server.js at http://127.0.0.1:" + app.get('port') + "  " + new Date());
});