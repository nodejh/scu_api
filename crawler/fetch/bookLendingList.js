// ====================
// 图书借阅列表
// ====================
const request = require('request');
const config = require('./../../config/config');
const log4js = require('./../../config/log4js');
const website = require('./../../config/website').lib;


const logger = log4js.getLogger('/models/fetch/bookLendingList');


/**
 * 获取图书借阅列表页面html
 * @param  {string} cookie 认证cookie信息
 * @return {promise}        借阅列表页面html
 */
const fetchBookLendingList = (cookie) => {
  logger.debug('cookie: ', cookie);
  const options = {
    url: website.url.books,
    headers: {
      Cookie: cookie,
      'User-Agent': config.crawler['User-Agent'],
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        logger.error('获取图书借阅列表失败: ', error);
        reject({
          code: 1025,
          error: '获取图书借阅列表失败',
          detail: error,
        });
      }
      logger.debug('response.statusCode: ', response.statusCode);
      if (response.statusCode !== 200) {
        reject({
          code: 1026,
          error: '获取图书借阅列表失败',
          detail: response,
        });
      }
      resolve(body);
    });
  });
};


module.exports = fetchBookLendingList;
