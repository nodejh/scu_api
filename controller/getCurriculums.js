// 获取课表
const fetchCurriculums = require('./../models/fetch/curriculums');
const parseCurriculums = require('./../models/parse/curriculums');
const log4js = require('./../conf/log4js');


const logger = log4js.getLogger('/controller/lib/booksLend');


const getCurriculums = (auth, callback) => {
  // 获取课表页面html
  fetchCurriculums(auth, (errFetch, resFetch) => {
    if (errFetch) {
      return callback(errFetch);
    }
    // 解析课表html
    parseCurriculums(resFetch, (errParse, resParse) => {
      logger.debug('errParse: ', errParse);
      if (errParse) {
        return callback(errParse);
      }
      logger.debug('curriculums: ', resParse);
      return callback(null, resParse);
    });
  });
};


module.exports = getCurriculums;
