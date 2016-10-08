// 获取课表
const request = require('request');
const iconv = require('iconv-lite');
const encrypt = require('./../../libs/encrypt');
const config = require('./../../conf/config');
const log4js = require('./../../conf/log4js');
const website = require('./../../conf/website').zhjw;


const logger = log4js.getLogger('/models/fetch/curriculums');


/**
 * 判断传入的参数是否正确
 * @method checkParams
 * @param  {object}    auth  认证信息，{key,token}
 * @return {object}    null/错误信息
 */
const checkParams = (auth) => {
  if (typeof auth !== 'object') {
    return {
      code: 1044,
      message: '获取课表传入参数错误',
      error: '获取课表传入参数错误',
    };
  }
  if (!auth.key) {
    return {
      code: 1045,
      message: '获取课表传入key参数错误',
      error: '获取课表传入key参数错误',
    };
  }
  if (!auth.token) {
    return {
      code: 1046,
      message: '获取课表传入token参数错误',
      error: '获取课表传入token参数错误',
    };
  }
  return null;
};


/**
 * 获取课表
 * @method fetchCurriculums
 * @param  {object}         auth     认证信息
 * @param  {Function}       callback
 * @return {object}         {error, curriculums}
 */
const fetchCurriculums = (auth, callback) => {
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
      return callback({
        code: 1047,
        error: '获取课表失败',
        detail: error,
      });
    }
    logger.debug('response.statusCode: ', response.statusCode);
    if (response.statusCode !== 200) {
      return callback({
        code: 1048,
        error: '获取课表失败',
        detail: response,
      });
    }
    const content = iconv.decode(body, 'GBK');
    logger.debug('content: ', content);
    return callback(null, content);
  });
};


module.exports = fetchCurriculums;
