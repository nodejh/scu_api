// 获取课表
const request = require('request');
const iconv = require('iconv-lite');
const config = require('./../../config/config');
const log4js = require('./../../config/log4js');
const website = require('./../../config/website').zhjw;


const logger = log4js.getLogger('/models/fetch/curriculums');


/**
 * 获取课表
 * @param  {string} cookie  登录后的 cookie 信息
 * @return {promise}        课表页面html
 */
const fetchCurriculums = (cookie) => {
  logger.debug('cookie: ', cookie);
  return new Promise((resolve, reject) => {
    const options = {
      url: website.url.curriculums,
      encoding: null,
      headers: {
        Cookie: cookie,
        'User-Agent': config.crawler['User-Agent'],
      },
    };
    request(options, (error, response, body) => {
      if (error) {
        logger.error('获取课表失败: ', error);
        reject({
          code: 1047,
          error: '获取课表失败',
          detail: error,
        });
      }
      logger.debug('response.statusCode: ', response.statusCode);
      if (response.statusCode !== 200) {
        reject({
          code: 1048,
          error: '获取课表失败',
          detail: response,
        });
      }
      const content = iconv.decode(body, 'GBK');
      logger.debug('content: ', content);
      reject(content);
    });
  });
};


module.exports = fetchCurriculums;
