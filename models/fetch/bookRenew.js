// ====================
// 续借图书
// ====================
const request = require('request');
const encrypt = require('./../encrypt');
const config = require('./../../conf/config');
const log4js = require('./../../conf/log4js');
const website = require('./../../conf/website').lib;


const logger = log4js.getLogger('/models/fetch/bookRenew');


/**
 * 判断传入的参数是否正确
 * @method checkParams
 * @param  {object}    auth  认证信息，{key,token}
 * @param  {object}    params  图书参数，{barCode,borId}
 * @return {object}    null/错误信息
 */
const checkParams = (auth, params) => {
  if (typeof auth !== 'object') {
    return {
      code: 1032,
      message: '续借图书传入参数错误',
      error: '续借图书传入参数错误',
    };
  }
  if (!auth.key) {
    return {
      code: 1033,
      message: '续借图书传入key参数错误',
      error: '续借图书传入key参数错误',
    };
  }
  if (!auth.token) {
    return {
      code: 1034,
      message: '续借图书传入token参数错误',
      error: '续借图书传入token参数错误',
    };
  }
  if (typeof params !== 'object') {
    return {
      code: 1035,
      message: '续借图书传入图书参数错误',
      error: '续借图书传入图书参数错误',
    };
  }
  if (!params.barCode) {
    return {
      code: 1036,
      message: '续借图书传入barCode参数错误',
      error: '续借图书传入barCode参数错误',
    };
  }
  if (!params.borId) {
    return {
      code: 1037,
      message: '续借图书传入borId参数错误',
      error: '续借图书传入borId参数错误',
    };
  }
  return null;
};


const bookRenew = (auth, params, callback) => {
  const authParams = checkParams(auth, params);
  if (authParams) {
    return callback(authParams);
  }
  const key = auth.key;
  const token = auth.token;
  const algorithm = config.encrypt.algorithm;
  const cookie = encrypt.decipher(algorithm, key, token);
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
