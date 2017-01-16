const config = {
  port: 3000,
  mongodb: 'mongodb://localhost:27017/scuapi',
  // 爬虫配置
  crawler: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
  },
};


module.exports = config;
