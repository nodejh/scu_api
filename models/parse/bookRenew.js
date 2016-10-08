// 解析续借图书页面
const cheerio = require('cheerio');
const log4js = require('./../../conf/log4js');
const libSpecialText = require('./libSpecialText');
const website = require('./../../conf/website').lib;


const logger = log4js.getLogger('/models/parse/bookRenew');


/**
 * 解析续借图书页面
 * @method bookRenew
 * @param  {string}   html     解析续借图书页面html
 * @param  {Function} callback
 * @return {object}   错误消息
 */
const bookRenew = (html, callback) => {
  const errCookieTips = libSpecialText.libCookieTips(html);
  logger.debug('errCookieTips: ', errCookieTips);
  if (errCookieTips) {
    return callback(errCookieTips);
  }
  logger.debug('html: ', html);
  const $ = cheerio.load(html, {
    ignoreWhitespace: true,
    xmlMode: false,
    lowerCaseTags: false,
  });
  if (html.indexOf(website.errorText.renewError) !== -1) {
    const text = $('.boxBd').text();
    logger.debug('text: ', text);
    return callback({
      code: 1040,
      error: text,
    });
  }
  return callback(null);
};


module.exports = bookRenew;
