// ====================
// 图书借阅列表
// ====================
const request = require('request');
const encrypt = require('./../../libs/encrypt');
const config = require('./../../conf/config');
const log4js = require('./../../conf/log4js');
const website = require('./../../conf/website').lib;


const logger = log4js.getLogger('/models/fetch/booksLend');


/**
 * 判断传入的参数是否正确
 * @method checkParams
 * @param  {object}    auth  认证信息，{key,token}
 * @return {object}    null/错误信息
 */
const checkParams = (auth) => {
  if (typeof auth !== 'object') {
    return {
      code: 1024,
      message: '获取图书借阅列表传入参数错误',
      error: '获取图书借阅列表传入参数错误',
    };
  }
  if (!auth.key) {
    return {
      code: 1022,
      message: '获取图书借阅列表传入key参数错误',
      error: '获取图书借阅列表传入key参数错误',
    };
  }
  if (!auth.token) {
    return {
      code: 1023,
      message: '获取图书借阅列表传入token参数错误',
      error: '获取图书借阅列表传入token参数错误',
    };
  }
  return null;
};


// 获取图书借阅列表
const fetchBooksLend = (auth, callback) => {
  const authParams = checkParams(auth);
  if (authParams) {
    return callback(authParams);
  }
  const key = auth.key;
  const token = auth.token;
  const algorithm = config.encrypt.algorithm;
  const cookie = encrypt.decipher(algorithm, key, token);
  logger.debug('cookie: ', cookie);
  const options = {
    url: website.url.books,
    headers: {
      Cookie: cookie,
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      logger.error('获取图书借阅列表失败: ', error);
      return callback({
        code: 1025,
        error: '获取图书借阅列表失败',
        detail: error,
      });
    }
    logger.debug('response.statusCode: ', response.statusCode);
    if (response.statusCode !== 200) {
      return callback({
        code: 1026,
        error: '获取图书借阅列表失败',
        detail: response,
      });
    }
    return callback(null, body);
  });
};


module.exports = fetchBooksLend;
