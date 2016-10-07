// ====================
// 图书借阅列表
// ====================
const request = require('superagent');
const charset = require('superagent-charset');
const encrypt = require('./../../libs/encrypt');
const config = require('./../../conf/config');
const log4js = require('./../../conf/log4js');
const website = require('./../../conf/website').lib;


const logger = log4js.getLogger('/models/getCurriculums');
charset(request);


// 获取图书借阅列表
function getBooksLend(auth, callback) {
  if (typeof auth !== 'object') {
    return callback({
      code: 1024,
      message: '获取图书借阅列表传入参数错误',
      error: '获取图书借阅列表传入参数错误',
    });
  }
  if (!auth.key) {
    return callback({
      code: 1022,
      message: '获取图书借阅列表传入key参数错误',
      error: '获取图书借阅列表传入key参数错误',
    });
  }
  if (!auth.token) {
    return callback({
      code: 1023,
      message: '获取图书借阅列表传入token参数错误',
      error: '获取图书借阅列表传入token参数错误',
    });
  }
  const key = auth.key;
  const token = auth.token;
  const algorithm = config.encrypt.algorithm;
  const cookie = encrypt.decipher(algorithm, key, token);
  logger.debug('cookie: ', cookie);
  request
    .get(website.url.showScribleList)
    .set('Cookie', cookie)
    .end((errBook, resBook) => {
      if (errBook) {
        logger.error('获取图书借阅列表失败', errBook);
        return callback({
          code: 1025,
          error: '获取图书借阅列表失败',
          detail: errBook,
        });
      }
      logger.debug('获取图书借阅列表: ', resBook);
      return callback({});
    });
}


module.exports = getBooksLend;
