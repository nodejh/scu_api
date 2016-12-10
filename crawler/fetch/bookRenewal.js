// ====================
// 续借图书
// ====================
const request = require('request');
const encrypt = require('./../encrypt');
const config = require('./../../conf/config');
const log4js = require('./../../conf/log4js');
const website = require('./../../conf/website').lib;


const logger = log4js.getLogger('/models/fetch/bookRenew');


const bookRenew = (cookie, params, callback) => {
  logger.debug('cookie: ', cookie);
  const barCode = params.barCode;
  const borId = params.borId;
  const urlPrefix = website.url.renewLinkPrefix;
  const options = {
    url: `${urlPrefix}&barcode=${barCode}&bor_id=${borId}`,
    headers: {
      Cookie: cookie,
      'User-Agent': config.crawler['User-Agent'],
    },
  };
  logger.debug('url: ', `${urlPrefix}&barcode=${barCode}&bor_id=${borId}`);
  request(options, (error, response, body) => {
    if (error) {
      logger.error('续借图书失败: ', error);
      return callback({
        code: 1038,
        error: '续借图书失败',
        detail: error,
      });
    }
    logger.debug('response.statusCode: ', response.statusCode);
    if (response.statusCode !== 200) {
      return callback({
        code: 1039,
        error: '续借图书失败',
        detail: response,
      });
    }
    // logger.debug('body: ', body);
    return callback(null, body);
  });
};


module.exports = bookRenew;
