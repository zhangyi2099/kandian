
module.exports = {
  Config: {
    timezone: 'Asia/Shanghai',
    siteName: '看点网',
    cookieSecret: '#$%nnja5720',
    salt: '#$%%^^^',
    port: 1000,
    interval: 1000 * 60 * 10,
    staticMaxAge: 3600000 * 24 * 1,
    limit: 10,
    hotQty: 4,
    maxRssItems: 50,
    neteaseTags: { //把apk改成zip, 解压进入/assets/default_columns.txt, 这个文件里面包含了全部栏目
      //http://c.3g.163.com/nc/topicset/android/subscribe.html
      '轻松一刻': 'T1350383429665',
      '今日之声': 'T1348654628034',
      '娱乐BigBang': 'T1359605557219',
      '易百科': 'T1355887570398',
      '历史七日谈': 'T1359605505216',
      '科技万有瘾力': 'T1359605530115',
      '新闻杂谈': 'T1363682618061',
      '新闻漫画': 'T1363328192298',
      '媒体速递': 'T1359605600543',
      '读写客': 'T1368508886668',
      '8点1氪': 'T1366183052543',
      '每日钛度': 'T1366183190095',
      /*'军情观察': 'T1359613635637',
      '另一面': 'T1348654756909',
      '深度': 'T1348648233485',
      '独家解读': 'T1348654778699',
      '女人': 'T1364183816404',*/
      '一周新闻日历': 'netease_yzxwrl',
      '尖峰娱论': 'netease_jfyl',
      '新闻故事': 'netease_xwgs',
      '独家图集': 'netease_djtj',
    },
    sohuTags: {
      '先知道': '681',
      '神吐槽': '682',
      '热辣评': '683',
      '变态辣椒':'677',
      '狐揭秘': 'sohu_hjm',
      '搜查科':'sohu_sck',
      '开心一刻': 'sohu_kxyk',
      '数说IT': 'sohu_shit',
      '红人红事榜': 'sohu_hrhsb',
      '图粹': 'sohu_photo_455',
      '图片故事': 'sohu_photo_456',
      '爱新奇': 'sohu_photo_465',
      '明星情史': 'sohu_photo_458',
      '明星旧照': 'sohu_photo_457',
      '趣图': 'sohu_photo_459',
      '清纯美女': 'sohu_photo_460',
       /*'IQ问答':'684',
      '留几手':'671',
      '黑眼睛看世界':'672',
      '微天下':'673',
      '祖德狐说':'674',
      'CAOTV观点保真':'675',
      '司马白话':'676',
      '钛媒体':'638',
      '知乎每日精选':'416',
      '挖段子•趣图':'610',
      '挖段子•冷笑话':'533',
      '趣图集':'500',
      '捧腹网':'501',
      '来福岛':'502',
      '搞笑哦':'528',
      '萝卜网':'530',
      '对路网':'532',
      '无聊哦':'580',
      '妹子图':'581',
      '一周图': 'yzt',
      '特别策划': '4741',
      '求是': 'qs',
      '烽火组': 'fhz',
      '今日谈': 'jrt',*/
    },
    sinaTags: {
      '今日网言': 'sina_jrwy',
      '新观察': 'sina_xgc',
      '海外观察': 'sina_hwgc',
      '军情茶馆': 'sina_jqcg',
      '万花筒': 'sina_wht',
    },
    qqTags: {
      '留声机': 'qq_news_lsj',
      '讲武堂': 'qq_news_jwt',
      '西洋镜': 'qq_news_xyj',
      '问编辑': 'qq_news_wbj',
      '新闻周考': 'qq_news_xwzk',
      '新闻哥': 'qq_news_xwg',
      //'找亮点': 'qq_news_zld',
      '猜新闻': 'qq_news_cxw',
      //'话题': 'qq_news_ht',
      '数据控': 'qq_news_sjk',
      '视界': 'qq_news_sj',
      '娱乐一周精选': 'qq_photo_ylyzjx',
      '一周图片精选': 'qq_photo_yztpjx',
      '脸谱': 'qq_photo_lp',
      '图话': 'qq_photo_th',
      '存照': 'qq_photo_cz',
      '去年今日': 'qq_photo_lp',
      '影像记忆': 'qq_photo_yxjy',
      '中国人的一天': 'qq_photo_zgrdyt',
    },
    ifengTags: { //把apk改成zip, 解压进入/assets/config.txt, 这个文件里面包含了全部栏目以及相关url, 另外/assets/temp.txt是json数据模板
      'FUN来了': 'ifeng_fun',
      '今日最大声':'ifeng_jrzds',
      '有报天天读':'ifeng_ybttd',
      '凤凰知道':'ifeng_fhzd',
      '史说新语': 'ifeng_ssxy',
      '百部穿影':'ifeng_bbcy', //http://ent.ifeng.com/movie/special/baibuchuanying/
      '财知道':'ifeng_czd',
      '观世变':'ifeng_gsb',
      '深度':'ifeng_sd',
      /*'历史': '',
      '独家评': '',
      '独家': '',
      '求是':'',
      '策划':'',
      '年代访':'',
      '剧观察':'',*/
    },
  }

};