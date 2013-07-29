var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var _ = require("lodash");
var jsdom = require("jsdom").jsdom;
var krTags = require('config').Config.krTags;
var tags = _.keys(krTags);
var News = require('./models/news');
var genLazyLoadHtml = require('./lib/utils').genLazyLoadHtml;
var genFindCmd = require('./lib/utils').genFindCmd;
var encodeDocID = require('./lib/utils').encodeDocID;
var genDigest = require('./lib/utils').genDigest;

var headers = {
  'Host': 'apis.36kr.com',
  'Connection': 'Keep-Alive',
  'User-Agent':'android-async-http/1.4.1 (http://loopj.com/android-async-http)',
  //'Accept-Encoding': 'gzip' //Do not enable gzip
};

var site = "36kr";

var categorys = [
  {cateid:1, first:1, label:"��ҳ", name:"topics", pagesize:10, maxpage:1719},
  {cateid:2, first:1, label:"���ⴴҵ��˾", name:"topics/category/us-startups", pagesize:10, maxpage:114},
  {cateid:3, first:1, label:"���ڴ�ҵ��˾", name:"topics/category/cn-startups", pagesize:10, maxpage:56},
  {cateid:4, first:1, label:"������Ѷ", name:"topics/category/breaking", pagesize:10, maxpage:706},
  {cateid:5, first:1, label:"������Ѷ", name:"topics/category/cn-news", pagesize:10, maxpage:64},
  {cateid:6, first:1, label:"���ʽ", name:"topics/category/digest", pagesize:10, maxpage:82},
  {cateid:7, first:1, label:"ר������", name:"topics/category/column", pagesize:10, maxpage:98},
];

function genBodyHtmlAndImg(obj) {
  var body = "";
  var img = [];
  var text = "";
  var j = 0;
  var reg = new RegExp("<img.+?src=[\'\"]http(?!http).+?[\'\"].+?\\/>","g");
  var regrn = new RegExp("\r\n","g");

  if((!obj) || (!obj.body_html)) {
    console.log("hzfdbg file[" + __filename + "]" + " genBodyHtmlAndImg():null");
    console.log(util.inspect(obj));
    return "";
  }

  //console.log("hzfdbg file[" + __filename + "]" + " genBodyHtmlAndImg() util.inspect(obj.body_html)="+util.inspect(obj));
  if(obj.body_html.length) {
    text = obj.body_html;
    text = text.replace(reg, function(url){
      var document = jsdom(url);
      var e = document.getElementsByTagName('img');
      url = e[0].getAttribute("src");
      img[j] = url;
      j += 1;
      //console.log("url="+url);
      return genLazyLoadHtml(obj.title, url);
    });
    text = text.replace(regrn,function(match) {
      return "<br/>";
    });
    body += text;//console.log("body="+body);
  }

  return {"body":body, "img":img};
}

var startGetDetail = new EventEmitter();

startGetDetail.on('startGetNewsDetail', function (entry) {
  getNewsDetail(entry);
});

var getNewsDetail = function(entry) {
  var bodyimg = genBodyHtmlAndImg(entry);

  News.findOne(genFindCmd(site, entry.id), function(err, result) {
    if(err) {
      console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail(), News.findOne():error " + err);
      return;
    }
    if (result) {
      //console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail(), News.findOne():exist ");
      return;
    }
    var obj = entry;
    obj.docid = encodeDocID(site, entry.id);
    obj.site = site;
    obj.body = bodyimg.body;
    obj.img = bodyimg.img;
    obj.link = util.format("http://www.36kr.com/t/%s", entry.id); // http://www.36kr.com/t/204970
    obj.title = entry.title;
    obj.excerpt = entry.excerpt;
    obj.ptime = entry.created_at;
    obj.time = new Date(Date.parse(entry.created_at));
    obj.marked = obj.body;
    obj.created = new Date();
    obj.views = 1;
    obj.tags = entry.tagName;
    obj.digest = genDigest(obj.body);
    obj.cover = entry.feature_img;
    if (!entry.feature_img && obj.img[0]) {
      obj.cover = obj.img[0];
    }

    News.insert(obj, function (err, result) {
      if(err) {
        console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail(), News.insert():error " + err);
      }
    }); // News.insert
  }); // News.findOne
};

var crawlerCategory = function (entry) {
  var MAX_PAGE_NUM = 3;
  var page = 1;

  if(entry.first == 1) {
    entry.first = 0;
    MAX_PAGE_NUM = 1 + entry.maxpage;
  }

  for(page=1; page<=MAX_PAGE_NUM; page++) {
    (function(page) {
    //http://apis.36kr.com/api/v1/topics.json?token=734dca654f1689f727cc:32710&page=1&per_page=10
    //http://apis.36kr.com/api/v1/topics/category/us-startups.json?token=734dca654f1689f727cc:32710&page=1&per_page=10
    var url = util.format("http://apis.36kr.com/api/v1/%s.json?token=734dca654f1689f727cc:32710&page=%d&per_page=%d", entry.name, page, entry.pagesize);
    request({uri: url, headers: headers/*, proxy: "http://127.0.0.1:7788"*/}, function (err, res, body) {
      if(err || (res.statusCode != 200) || (!body)) {
        console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():error");
        console.log(err);console.log(url);/*console.log(util.inspect(res));*/console.log(body);
        return;
      }
      var json = null;
      try {
        json = JSON.parse(body);
      }
      catch (e) {
        json = null;
        console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():JSON.parse() catch error");
        console.log(e);
      }
      if(!json) {
        console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():JSON.parse() error");
        return;
      }
      var newsList = json;
      if((!newsList) || (!newsList.length) || (newsList.length <= 0)) {
        console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():newsList empty in url " + url);
        return;
      }
      newsList.forEach(function(newsEntry) {
        //console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():title="+newsEntry.title);
        for(var i = 0; i < tags.length; i++) {
          try {
            if (newsEntry.title.indexOf(tags[i]) !== -1) {
              //console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():title="+newsEntry.title);
              newsEntry.tagName = tags[i];
              newsEntry.cateid = entry.cateid;
              newsEntry.pageindex = page;

              News.findOne(genFindCmd(site,newsEntry.id), function(err, result) {
                if(err) {
                  console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory(), News.findOne():error " + err);
                  return;
                }
                if (!result) {
                  console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():["+newsEntry.tagName+"]"+newsEntry.title+",docid="+newsEntry.id);
                  if(newsEntry.body_html) {
                    startGetDetail.emit('startGetNewsDetail', newsEntry);
                  }else { // ��Щ�Ͼɵ�����ժҪ��û��body_html�ֶΣ���Ҫ���������ȡ
                    // http://apis.36kr.com/api/v1/topics/204615.json?token=734dca654f1689f727cc:32710
                    var detailUrl = util.format("http://apis.36kr.com/api/v1/topics/%s.json?token=734dca654f1689f727cc:32710", newsEntry.id);
                    request({uri: detailUrl, headers: headers/*, proxy: "http://127.0.0.1:7788"*/}, function (err, res, body) {
                      if(err || (res.statusCode != 200) || (!body)) {
                        console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():detailUrl error");
                        console.log(err);console.log(detailUrl);/*console.log(util.inspect(res));*/console.log(body);
                        return;
                      }
                      var entry = null;
                      try {
                        entry = JSON.parse(body);
                      }
                      catch (e) {
                        entry = null;
                        console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():detailUrl JSON.parse() catch error");
                        console.log(e);
                      }
                      if(!entry) {
                        console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():detailUrl JSON.parse() error");
                        return;
                      }
                      console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory():detailUrl="+detailUrl);
                      newsEntry.body_html = entry.body_html;
                      startGetDetail.emit('startGetNewsDetail', newsEntry);
                    });//request
                  }
                }
              }); // News.findOne
            }
          }
          catch (e) {
            console.log("hzfdbg file[" + __filename + "]" + " crawlerCategory(): catch error");
            console.log(e);
            continue;
          }
        }//for
      });//forEach
    });//request
    })(page);
  }//for
};

var krCrawler = function() {
  console.log("hzfdbg file[" + __filename + "]" + " krCrawler():Start time="+new Date());

  categorys.forEach(function(entry) {
    crawlerCategory(entry);
  });//forEach

  setInterval(krCrawler, 1000 * 60 * 30);
}

exports.krCrawler = krCrawler;
krCrawler();