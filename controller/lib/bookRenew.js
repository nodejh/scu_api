// 续借图书
const fetchBookRenew = require('./../../models/fetch/bookRenew');
const parseBookRenew = require('./../../models/parse/bookRenew');
const log4js = require('./../../conf/log4js');


const logger = log4js.getLogger('/controller/lib/bookRenew');


const bookRenew = (auth, params, callback) => {
  // 获取续借图书操作结果页面html
  fetchBookRenew(auth, params, (errFetch, resFetch) => {
    if (errFetch) {
      return callback(errFetch);
    }
    // 解析续借图书操作结果页面html
    parseBookRenew(resFetch, (errParse) => {
      if (errParse) {
        logger.debug('errParse: ', errParse);
        return callback(errParse);
      }
      // 错误消息为 null，说明续借成功
      return callback(null);
    });
  });
};


module.exports = bookRenew;
