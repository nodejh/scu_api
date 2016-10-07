// 解析借阅信息页面
const cheerio = require('cheerio');
const log4js = require('./../../conf/log4js');
const checkSpecialText = require('./checkSpecialText');

const logger = log4js.getLogger('/models/parse/booksLend');


const booksLend = (html, callback) => {
  const errCookieTips = checkSpecialText.libCookieTips(html);
  logger.debug('errCookieTips: ', errCookieTips);
  if (errCookieTips) {
    return callback(errCookieTips);
  }
  const $ = cheerio.load(html, {
    ignoreWhitespace: true,
    xmlMode: false,
    lowerCaseTags: false,
  });
  const bodyStart = html.indexOf('<body');
  const bodyEnd = html.indexOf('</body');
  const body = html.substring(bodyStart, bodyEnd);
  logger.debug(body);
  const domBooks = $('.boxBd').find('.sheet');
  const booksNumber = domBooks.length; // 借阅数量
  logger.debug(domBooks.length);
  const books = [];
  domBooks.each(function () {
    const barCodeValue = $(this).find('td').eq(5).find('form input')
        .eq(0)
        .attr('value');
    const borIdValue = $(this).find('td').eq(5).find('form input')
        .eq(1)
        .attr('value');
    books.push({
      // 作者
      author: $(this).find('td').eq(0).text(),
      // 书名
      name: $(this).find('td').eq(1).text(),
      // 应还日期
      expiredate: $(this).find('td').eq(2).text(),
      // 分馆
      libraryBranch: $(this).find('td').eq(3).text(),
      // 索书号
      number: $(this).find('td').eq(4).text(),
      borId: borIdValue,
      barCode: barCodeValue,
    });
  });
  logger.debug('books: ', books);
  return callback(null, {
    booksNumber,
    books,
  });
};


module.exports = booksLend;
