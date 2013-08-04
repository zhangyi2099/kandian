﻿module.exports = {
  Config: {
    timezone: 'Asia/Shanghai',
    siteName: '看点网',
    cookieSecret: '#$%nnja5720',
    salt: '#$%%^^^',
    port: 8888,
    interval: 1000 * 60 * 20,
    staticMaxAge: 3600000 * 24 * 1,
    limit: 15,
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
      '军情观察': 'T1359613635637',
      '另一面': 'T1348654756909',
      '网易深度': 'T1348648233485',
      '真话': 'T1370583240249',
      '专业控': 'T1348654797196',
      '数读': 'T1348654813857',
      '军事控': 'T1373337069422',
      '科学现场调查': 'T1371610585877',
      '独家解读': 'T1348654778699',
      '健康养生': 'T1370589182416',
      '网易女人': 'T1364183816404',
      '一周新闻日历': 'netease_yzxwrl',
      '尖峰娱论': 'netease_jfyl',
      '微历史': 'netease_wls',
      '新闻故事': 'netease_xwgs',
      '独家图集': 'netease_djtj',
    },
    sohuTags: {
      '先知道': '681',
      '神吐槽': '682',
      '热辣评': '683',
      '我来说两句':'915',
      '变态辣椒':'677',
      '狐揭秘': 'sohu_hjm',
      '搜查科':'sohu_sck',
      '开心一刻': 'sohu_kxyk',
      '数说IT': 'sohu_shit',
      '红人红事榜': 'sohu_hrhsb',
      '快评': 'sohu_kp',
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
      '影像志':'ifeng_yxz',
      '凤凰热追踪':'ifeng_fhrzz',
      '财知道':'ifeng_czd',
      '观世变':'ifeng_gsb',
      '深度':'ifeng_sd',
      '军魂100分': 'ifeng_jhybf',
      '真相80分': 'ifeng_zxbsf',
      '史林拍案': 'ifeng_slpa',
      '话说':'ifeng_hs',
      '一周人物':'ifeng_yzrw',
      /*'历史': '',
      '历史上的今天':'ifeng_lssdjt',
      '独家评': '',
      '独家': '',
      '求是':'',
      '策划':'',
      '年代访':'',
      '鲁豫有约':'ifeng_lyyy',
      '凤凰专家谈':'ifeng_fhzjt',
      '旧文重拾':'ifeng_jwcs',
      '剧观察':'',*/
    },
    yokaTags: {
      '星妆容红黑榜': 'yoka_hhb',
      '笑到抽筋': 'yoka_xdcj',
      '每日新闻5头条': 'yoka_xwwtt',
      '明星皆为微博狂': 'yoka_wbk',
      '星大片': 'yoka_xdp',
      '达人极品晒': 'yoka_drjps',
      '谁八卦啊你八卦': 'yoka_bg',
      '穿衣奇葩货': 'yoka_qph',
      '十万个护肤冷知识': 'yoka_hflzs',
      '周六蹲点儿看街拍': 'yoka_jp',
      '麻辣男题': 'yoka_mlnt',
      '每日时髦不NG': 'yoka_smbng',
      '一周穿衣红榜': 'yoka_cyhb',
      '女人必知': 'yoka_nrbz',
      '女人必备': 'yoka_nrbb',
      '情感攻略': 'yoka_qggl',
      '健康课堂': 'yoka_jkkt',
      '两性趣谈': 'yoka_lxqt',
      '主妇反思': 'yoka_zffs',
      '婆媳过招': 'yoka_pxgz',
      '情感秘笈': 'yoka_qgmj',
      '排行榜': 'yoka_phb',
      '1日1话题': 'yoka_yryht',
    },
    krTags: {
      '8点1氪': 'kr_bdyk',
      '创业说': 'kr_cys',
      '氪周刊': 'kr_kzk',
      '氪月报': 'kr_kyb',
      '超人计划': 'kr_crjh',
      '36氪+': 'kr_sslkj',
      '36氪开放日': 'kr_sslkkfr',
    },
    huxiuTags: {
      '早报': 'huxiu_zb',
      '今日嗅评': 'huxiu_jrxp',
      '大话科技': 'huxiu_dhkj',
      '移动观察': 'huxiu_ydgc',
    },
    iheimaTags: {
      '每日一黑马': 'iheima_mryhm',
      '每日黑马': 'iheima_mrhm',
      '挖黑马': 'iheima_whm',
      '侃产品': 'iheima_kcp',
      '头条汇': 'iheima_kjtth',
      '小败局': 'iheima_xbj',
      '独家分析': 'iheima_djfx',
      '创业说': 'iheima_cys',
      '找灵感': 'iheima_zlg',
      '产品家': 'iheima_cpj',
      '挖黑马': 'iheima_whm',
      '商业模式': 'iheima_syms',
      'i黑马榜': 'iheima_ihmb',
      '融资趋势': 'iheima_rzqs',
      '大买家': 'iheima_dmj',
      '黑马YY': 'iheima_hmyy',
    },
    businessvalueTags: {
      '特别策划': 'ch',
      '价值文摘': 'jzwz',
      '先锋': 'xf',
      '创新潮流': 'cxcl',
      '资本动向': 'zbdx',
      '企业变革': 'qybg',
      '焦点行业': 'jdhy',
      '基本面': 'jbm',
      '新视野': 'xsy',
      '反潮流': 'fcl',
      '对话': 'dh',
      'CSR竞争力': 'jzl',
      '关键时候': 'gjsh',
      '商学院': 'sxy',
      '思想速读': 'sxsd',
      '态度': 'td',
      '编者的话': 'bzdh',
    },
  },
};