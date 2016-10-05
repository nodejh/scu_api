// 模拟登录图书馆
const request = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const regexp = require('./../lib/regexp');
const log4js = require('./../conf/log4js');
const website = require('./../conf/website').lib;


const logger = log4js.getLogger('/models/loginLib');
charset(request);


function loginLib(number, password, callback) {
  logger.debug('number && password\n', number, password);

  if (!regexp.number.test(number)) {
    return callback({ code: 1001, error: '学号格式错误' });
  }

  if (!regexp.number.test(password)) {
    return callback({ code: 1002, error: '密码格式错误' });
  }

  const data = {
    __EVENTTARGET: '',
    __EVENTARGUMENT: '',
    __VIEWSTATE: website.request.VIEWSTATE,
    __VIEWSTATEGENERATOR: website.request.VIEWSTATEGENERATOR,
    'LoginView_user:readercode_txt': number,
    'LoginView_user:readerpsd_txt': password,
    'LoginView_user:reader_login.x': website.request.reader_login_x,
    'LoginView_user:reader_login.y': website.request.reader_login_y,
  };
  request
    .post(`${website.url.login}`)
    .send(data)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Accept', '*/*')
    .set('Cache-Control', 'max-age=0')
    .set('Expect', '100-continue')
    // .set()
    .end((err, res) => {
      if (err) {
        logger.error('模拟登陆图书馆失败\n', err);
        return callback({
          code: 1016,
          error: '模拟登陆图书馆失败',
          detail: err,
        });
      }
      logger.debug('res.headers: \n', res.headers, '\n', res.header);
      logger.debug('模拟登录 url：', `${website.url.login}`);
      // 判断是否登录成功
      // 如果 res.redirects.length > 0，则说明登录成功
      logger.debug('redirect: \n', res.redirects);
      if (res.redirects.length !== 1) {
        return callback({
          code: 1016,
          error: '模拟登陆图书馆失败，可能是学号或密码错误',
        });
      }
      const redirect = res.redirects[0];
      // return callback({ err });
      request
        .post(redirect)
        .send(data)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', '*/*')
        .set('Cache-Control', 'max-age=0')
        .end((errs, ress) => {
          logger.debug('redirect...\n');
          // logger.debug(ress);
          logger.debug('redirect: \n', ress.redirects);
          logger.debug(errs);
          logger.debug('header:\n ', ress.headers, '\n', ress.header);
          // const cookie = res.header['set-cookie'];
          // logger.debug('cookie:\n ', cookie);
          // return callback(null, cookie);
          return callback({ err });
        });
    });
}


module.exports = loginLib;
