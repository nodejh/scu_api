// 解析借阅信息页面
const cheerio = require('cheerio');
const log4js = require('./../../config/log4js');
const libSpecialText = require('./libSpecialText');


const logger = log4js.getLogger('/models/analyse/bookLendingList');


const booksLend = (html) => {
  const errCookieTips = libSpecialText.libCookieTips(html);
  logger.debug('errCookieTips: ', errCookieTips);
  if (errCookieTips) {
    return { error: errCookieTips };
  }
  const $ = cheerio.load(html, {
    ignoreWhitespace: true,
    xmlMode: false,
    lowerCaseTags: false,
  });
  // const bodyStart = html.indexOf('<body');
  // const bodyEnd = html.indexOf('</body');
  // const body = html.substring(bodyStart, bodyEnd);
  // logger.debug(body);
  const domBooks = $('.boxBd').find('.sheet');
  const booksNumber = domBooks.length; // 借阅数量
  logger.debug(domBooks.length);
  const books = [];
  domBooks.each(function domBook() {
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
  return {
    error: null,
    booksNumber,
    books,
  };
};


module.exports = booksLend;
