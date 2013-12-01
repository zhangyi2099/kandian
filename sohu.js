﻿var util = require('util');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var _ = require("lodash");
var sohuTags = require('config').Config.sohuTags;
var tags = _.keys(sohuTags);
var News = require('./models/news');
var genLazyLoadHtml = require('./lib/utils').genLazyLoadHtml;
var genFindCmd = require('./lib/utils').genFindCmd;
var encodeDocID = require('./lib/utils').encodeDocID;
var data2Json = require('./lib/utils').data2Json;
var genDigest = require('./lib/utils').genDigest;
var xml2json = require('xml2json');
var jsdom = require("jsdom").jsdom;

var proxyEnable = 0;
var proxyUrl = 'http://127.0.0.1:7788';
var headers = {
  'Content-Encoding': 'UTF-8',
  'Content-Type': 'text/plain',
  //'Accept-Encoding': 'gzip,deflate',
  //'Accept': '*/*',
  'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1',
  //'Authorization': 'SZ7224055938192',
  //'SCOOKIE': '357bcc08def6394f137c5c3ae4d71ffe55a73d197033e5ba3f75c403266180108387629c5c78a86e3134c12c5b7a286c7f539a3393e84b80987eea4a97fb151884a6bb77077ede9d56e0e68fcc05d487e2d9ff53bda32e86b8298b2a9887b039316b4299e0d8bb60ce654f7763ac4190dadbb75ee90c28a78c82db303f3f02c4b1dcec72bd17e75c37eb4ab86046894dbae45fbbe72bddb6331353661b6484c85a883a8498c370eec23f5113d5c549335b9c76c536b7b750ab62c6a392ee48e8',
  'Host': 'api.k.sohu.com',
  'Connection': 'Keep-Alive',
};
var site = "sohu";

function pickImg(html) {
  var document = jsdom(html);
  objs = document.getElementsByTagName('img');
  var img = [];
  if(objs) {
    for(i=0; i<objs.length; i++) {
      img[i] = {};
      img[i].src = objs[i].getAttribute('data-src');
      img[i].alt = objs[i].getAttribute('alt');
      img[i].originsrc = objs[i].getAttribute("src");
    }
  }
  return img;
}

var startGetDetail = new EventEmitter();

startGetDetail.on('startGetNewsDetail', function (entry) {
  getNewsDetail(entry);
});

startGetDetail.on('startGetPhotoDetail', function (entry) {
  getPhotoDetail(entry);
});

var getNewsDetail = function(entry) {
  // http://api.k.sohu.com/api/news/article.go?newsId=7189277
  var detailLink = 'http://api.k.sohu.com/api/news/article.go?newsId=%s';
  var docid = util.format("%s",entry.newsId);
  var url = util.format(detailLink, docid);
  var req = {uri: url, method: "GET", headers: headers};
  if(proxyEnable) {
    req.proxy = proxyUrl;
  }
  request(req, function (err, res, body) {
    if(err || (res.statusCode != 200) || (!body)) {
        console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail():error");
        console.log(err);console.log(url);console.log(util.inspect(res));console.log(body);
        return;
    }
    //console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail() util.inspect(body)="+util.inspect(body));
    var json = xml2json.toJson(body,{object:true, sanitize:false});
    if(!json) {
      console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail():json null");
      return;
    }
    var jObj = json.root;
    var obj = entry;
    News.findOne(genFindCmd(site, docid), function(err, result) {
      if(err) {
        console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail(), News.findOne():error " + err);
        return;
      }
      if (result) {
        //console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail(), News.findOne():exist ");
        return;
      }
      obj.docid = encodeDocID(site, docid);
      obj.site = site;
      obj.body = jObj.content.replace(/90_90/gi,"602_1000");//小图片替换为大图片
      obj.img = pickImg(obj.body);
      obj.video = [];
      obj.link = "";
      if(jObj.link) {
        obj.link = jObj.link; // http://3g.k.sohu.com/t/n7189277
      }else {
        obj.link = util.format("http://3g.k.sohu.com/t/n%s", docid); // http://3g.k.sohu.com/t/n7189277
      }
      obj.title = entry.title.trim().replace(/\s+/g, '');
      obj.ptime = jObj.time;
      obj.time = new Date(Date.parse(jObj.time));
      obj.marked = obj.body;
      obj.created = new Date();
      obj.views = 1;
      obj.tags = entry.tagName;
      obj.digest = genDigest(obj.body);
      if(entry.listPic) {
        obj.cover = entry.listPic;
      } else if(entry.bigPic) {
        obj.cover = entry.bigPic;
      } else if(entry.listpic) {
        obj.cover = entry.listpic;
      } else if(obj.img[0]) {
        obj.cover = obj.img[0].src;
      } else if (obj.img[1]) {
        obj.cover = obj.img[1].src;
        //console.log("hzfdbg file[" + __filename + "]" + " cover="+obj.cover);
      }

      // img lazyloading
      for(i=0; i<obj.img.length; i++) {
        var imgHtml = genLazyLoadHtml(obj.img[i].alt, obj.img[i].originsrc);
        //obj.marked = obj.marked.replace(/<img.*?\/>/gi, imgHtml);
        //console.log("hzfdbg file[" + __filename + "]" + " imgHtml="+imgHtml);
      };

      News.insert(obj, function (err, result) {
        if(err) {
          console.log("hzfdbg file[" + __filename + "]" + " getNewsDetail(), News.insert():error " + err);
        }
      }); // News.insert
    }); // News.findOne
  });// request
};

function genBodyHtml(obj) {
  var body = "";
  var text = "";
  var last_text = "";
  var i = 0;

  if((!obj) || (!obj.gallery)) {
    console.log("hzfdbg file[" + __filename + "]" + " genBodyHtml():null");
    return "";
  }

  body = obj.title + "<br>";
  var list = obj.gallery.photo;
  //console.log("hzfdbg file[" + __filename + "]" + " genBodyHtml() util.inspect(list)="+util.inspect(list));

  for(i=0; i<list.length; i++) {
    if(list[i].abstract.length) {
      text = list[i].abstract;
    }else if(list[i].ptitle.length){
      text = list[i].ptitle;
    }else {
      text = "";
      console.log("hzfdbg file[" + __filename + "]" + " genBodyHtml():text null");
    }

    if((0 == i) && (obj.title == text)) {
      body += "";
    }else {
      body += (text == last_text)?"":text;
    }

    last_text = text;
    body += genLazyLoadHtml(text, list[i].pic);
  }

  return body;
}

function pickPhotos(obj) {
  var img = [];
  var i = 0;

  if((!obj) || (!obj.gallery)) {
    console.log("hzfdbg file[" + __filename + "]" + " pickPhotos():null");
    return "";
  }

  var list = obj.gallery.photo;;

  for(i=0; i<list.length; i++) {
    img[i] = list[i].pic;
  }

  return img;
}

var getPhotoDetail = function(entry) {
  // http://api.k.sohu.com/api/photos/gallery.go?gid=78233&from=tag&fromId=455&supportTV=1&refer=null&p1=NTcyODc5OTc0MzU5Nzg3NTIyOQ%3D%3D
  // http://api.k.sohu.com/api/photos/gallery.go?gid=78233
  var docid = util.format("%s",entry.gid);
  var url = util.format("http://api.k.sohu.com/api/photos/gallery.go?gid=%s&from=tag&fromId=%s&supportTV=1&refer=null&p1=NTcyODc5OTc0MzU5Nzg3NTIyOQ%3D%3D", docid, entry.tagId);
  var req = {uri: url, method: "GET", headers: headers};
  if(proxyEnable) {
    req.proxy = proxyUrl;
  }
  request(req, function (err, res, body) {
    if(err || (res.statusCode != 200) || (!body)) {
      console.log("hzfdbg file[" + __filename + "]" + " getPhotoDetail():error");
      console.log(err);console.log(url);console.log(util.inspect(res));console.log(body);
      return;
    }
    //console.log("hzfdbg file[" + __filename + "]" + " getPhotoDetail() util.inspect(body)="+util.inspect(body));
    var json = xml2json.toJson(body,{object:true, sanitize:false});
    if(!json) {
      console.log("hzfdbg file[" + __filename + "]" + " getPhotoDetail():json null");
      return;
    }
    var jObj = json.root;
    var obj = entry;
    News.findOne(genFindCmd(site, docid), function(err, result) {
      if(err) {
        console.log("hzfdbg file[" + __filename + "]" + " getPhotoDetail(), News.findOne():error " + err);
        return;
      }
      if (result) {
        //console.log("hzfdbg file[" + __filename + "]" + " getPhotoDetail(), News.findOne():exist ");
        return;
      }
      obj.docid = encodeDocID(site, docid);
      obj.site = site;
      obj.body = genBodyHtml(jObj);
      obj.img = pickPhotos(jObj);
      obj.video = [];
      obj.link = "";
      if(jObj.shareLink) {
        obj.link = jObj.shareLink; // http://3g.k.sohu.com/t/p78321
      }else {
        obj.link = util.format("http://3g.k.sohu.com/t/p%s", docid); // http://3g.k.sohu.com/t/p78321
      }
      obj.title = entry.title.trim().replace(/\s+/g, '');
      obj.ptime = jObj.time;
      obj.time = new Date(Date.parse(jObj.time));
      obj.marked = obj.body;
      obj.created = new Date();
      obj.views = 1;
      obj.tags = entry.tagName;
      obj.digest = genDigest(obj.body);
      obj.cover = "";
      if(entry.images[0]) {
        obj.cover = entry.images[0];
      } else if(obj.img[0]) {
        obj.cover = obj.img[0];
      }

      News.insert(obj, function (err, result) {
        if(err) {
          console.log("hzfdbg file[" + __filename + "]" + " getPhotoDetail(), News.insert():error " + err);
        }
      }); // News.insert
    }); // News.findOne
  });// request
};

var crawlerHeadLineFirstTime = 0; //Crawl more pages at the first time
var crawlerHeadLine = function () {
  // http://api.k.sohu.com/api/channel/news.go?channelId=1&num=20&page=1&showPic=1&rt=json
  // http://api.k.sohu.com/api/channel/news.go?channelId=1&num=20&page=1650&showPic=1&rt=json
  var headlineLink = 'http://api.k.sohu.com/api/channel/news.go?channelId=1&num=20&page=%d&rt=json';
  var MAX_PAGE_NUM = 3;
  var page = 1;
  if(crawlerHeadLineFirstTime) {
    //console.log("hzfdbg file[" + __filename + "]" + " crawlerHeadLine(): All");
    MAX_PAGE_NUM = 5;//1650;
    crawlerHeadLineFirstTime = 0;
  }
  for(page=1; page<=MAX_PAGE_NUM; page++) {
    (function(page) {
    var url = util.format(headlineLink, page);
    var req = {uri: url, method: "GET", headers: headers};
    if(proxyEnable) {
      req.proxy = proxyUrl;
    }
    request(req, function (err, res, body) {
      var json = data2Json(err, res, body);
      if(!json) {
        console.log("hzfdbg file[" + __filename + "]" + " crawlerHeadLine():JSON.parse() error");
        return;
      }
      var newsList = json["articles"];
      if((!newsList) || (!newsList.length) || (newsList.length <= 0)) {
        //console.log("hzfdbg file[" + __filename + "]" + " crawlerHeadLine():newsList empty in url " + url);
        return;
      }
      newsList.forEach(function(newsEntry) {
        for(var i = 0; i < tags.length; i++) {
          if(sohuTags[tags[i]].indexOf("sohu_") === -1) {//crawlerTags will handle these tags, so skip them here
            continue;
          }
          try {
            if (newsEntry.title.indexOf(tags[i]) !== -1) {
              newsEntry.tagName = tags[i];
              News.findOne(genFindCmd(site, newsEntry.newsId), function(err, result) {
                if(err) {
                  console.log("hzfdbg file[" + __filename + "]" + " crawlerHeadLine(), News.findOne():error " + err);
                  return;
                }
                if (!result) {
                  console.log("hzfdbg file[" + __filename + "]" + " crawlerHeadLine():["+newsEntry.tagName+"]"+newsEntry.title+",docid="+newsEntry.newsId);
                  startGetDetail.emit('startGetNewsDetail', newsEntry);
                }
              }); // News.findOne
            }
          }
          catch (e) {
            console.log("hzfdbg file[" + __filename + "]" + " crawlerHeadLine(): catch error");
            console.log(e);
            continue;
          }
        }//for
      });//forEach
    });//request
    })(page);
  }//for
};

var crawlerPhotoFirstTime = {}; //Crawl more pages at the first time
var crawlerPhoto = function (tag, id) {
  var MAX_PAGE_NUM = 1;
  var page = 0;
  if(!crawlerPhotoFirstTime[tag]) {
    //console.log("hzfdbg file[" + __filename + "]" + " crawlerPhoto(): All, tag="+tag);
    MAX_PAGE_NUM = 3;//25;
    crawlerPhotoFirstTime[tag] = 1;
  }
  for(page=1; page<=MAX_PAGE_NUM; page++) {
    (function(page) {
    var url = "";
    if(1 == page) {
      url = util.format("http://api.k.sohu.com/api/photos/list.go?&tagId=%s&rt=json&p1=NTcyODc5OTc0MzU5Nzg3NTIyOQ%3D%3D", id);
    }else {
      url = util.format("http://api.k.sohu.com/api/photos/list.go?&tagId=%s&rt=json&pageNo=%d&pageSize=10&p1=NTcyODc5OTc0MzU5Nzg3NTIyOQ%3D%3D", id, page);
    }
    var req = {uri: url, method: "GET", headers: headers};
    if(proxyEnable) {
      req.proxy = proxyUrl;
    }
    request(req, function (err, res, body) {
      var json = data2Json(err, res, body);
      if(!json) {
        console.log("hzfdbg file[" + __filename + "]" + " crawlerPhoto():JSON.parse() error");
        return;
      }
      var newsList = json["news"];
      if((!newsList) || (!newsList.length) || (newsList.length <= 0)) {
        //console.log("hzfdbg file[" + __filename + "]" + " crawlerPhoto():newsList empty in url " + url);
        return;
      }
      newsList.forEach(function(newsEntry) {
        try {
          newsEntry.tagName = tag;
          newsEntry.tagId = id;
          News.findOne(genFindCmd(site, newsEntry.gid), function(err, result) {
            if(err) {
              console.log("hzfdbg file[" + __filename + "]" + " crawlerPhoto(), News.findOne():error " + err);
              return;
            }
            if (!result) {
              console.log("hzfdbg file[" + __filename + "]" + " crawlerPhoto():["+newsEntry.tagName+"]"+newsEntry.title+",docid="+newsEntry.gid);
              startGetDetail.emit('startGetPhotoDetail', newsEntry);
            }
          }); // News.findOne
        }
        catch (e) {
          console.log("hzfdbg file[" + __filename + "]" + " crawlerPhoto(): catch error");
          console.log(e);
        }
      });//forEach
    });//request
    })(page);
  }//for
};

var crawlerPhotos = function () {
  var prefix = "sohu_photo_";
  tags.forEach(function(tagName) {
    if(sohuTags[tagName].indexOf(prefix) != -1) {
      crawlerPhoto(tagName,sohuTags[tagName].slice(prefix.length));
    }
  });
}

var crawlerTagFirstTime = {}; //Crawl more pages at the first time
var crawlerTag = function (tag, id) {
  // http://api.k.sohu.com/api/flow/newslist.go?subId=681&pubId=0&sid=18&rt=flowCallback&pageNum=1
  var tagLink = 'http://api.k.sohu.com/api/flow/newslist.go?subId=%s&pubId=0&sid=18&rt=json&pageNum=%d';
  var MAX_PAGE_NUM = 1;
  var page = 1;
  if(!crawlerTagFirstTime[tag]) {
    //console.log("hzfdbg file[" + __filename + "]" + " crawlerTag(): All, tag="+tag);
    MAX_PAGE_NUM = 2;//6;
    crawlerTagFirstTime[tag] = 1;
  }
  for(page=1; page<=MAX_PAGE_NUM; page++) {
    (function(page) {
    var url = util.format(tagLink, id, page);
    var req = {uri: url, method: "GET", headers: headers};
    if(proxyEnable) {
      req.proxy = proxyUrl;
    }
    request(req, function (err, res, body) {
      var json = data2Json(err, res, body);
      if(!json) {
        console.log("hzfdbg file[" + __filename + "]" + " crawlerTag():JSON.parse() error");
        return;
      }
      var newsList = json.newsList;
      if((!newsList) || (newsList.length <= 0)) {
        console.log("hzfdbg file[" + __filename + "]" + " crawlerTag():newsList empty in url " + url);
        return;
      }
      newsList.forEach(function(newsEntry) {
        newsEntry.tagName = tag;
        News.findOne(genFindCmd(site, newsEntry.newsId), function(err, result) {
          if(err) {
            console.log("hzfdbg file[" + __filename + "]" + " crawlerTag(), News.findOne():error " + err);
            return;
          }
          if (!result) {
            console.log("hzfdbg file[" + __filename + "]" + " crawlerTag():["+newsEntry.tagName+"]"+newsEntry.title+",docid="+newsEntry.newsId);
            startGetDetail.emit('startGetNewsDetail', newsEntry);
          }
        }); // News.findOne
      });//forEach
    });//request
    })(page);
  }//for
};

var crawlerTags = function () {
  tags.forEach(function(tagName) {
    if(sohuTags[tagName].indexOf("sohu_") === -1) {
      crawlerTag(tagName,sohuTags[tagName]);
    }
  });
}

var sohuCrawler = function() {
  console.log("hzfdbg file[" + __filename + "]" + " sohuCrawler():Date="+new Date());
  crawlerTags();
  crawlerHeadLine();
  crawlerPhotos();
  setTimeout(sohuCrawler, 1000 * 60 * 60);
}

exports.sohuCrawler = sohuCrawler;
sohuCrawler();