// 借阅列表
const fetchBooksLend = require('./../../models/fetch/booksLend');
const parseBooksLend = require('./../../models/parse/booksLend');
const log4js = require('./../../conf/log4js');


const logger = log4js.getLogger('/controller/lib/booksLend');


const booksLend = (auth, callback) => {
  // 获取借阅列表页面html
  fetchBooksLend(auth, (errFetch, resFetch) => {
    if (errFetch) {
      return callback(errFetch);
    }
    // 解析借阅列表html
    parseBooksLend(resFetch, (errParse, resParse) => {
      logger.debug('errParse: ', errParse);
      if (errParse) {
        return callback(errParse);
      }
      logger.debug('books: ', resParse);
      return callback(null, { books: resParse });
    });
  });
};


module.exports = booksLend;
