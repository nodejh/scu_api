// 模拟登录图书馆
const request = require('superagent');
const charset = require('superagent-charset');
const regexp = require('./../../libs/regexp');
const log4js = require('./../../conf/log4js');
const website = require('./../../conf/website').lib;


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
    schoolid: website.schoolid,
    backurl: '',
    userType: 0,
    username: number,
    password,
  };
  logger.debug('模拟登录 url：', `${website.url.login}`);
  logger.debug('data: ', data);
  request
    .get(website.url.home)
    .end((errHome, resHome) => {
      if (errHome) {
        logger.error('抓取图书馆首页失败\n', errHome);
        return callback({
          code: 1016,
          error: '模拟登陆图书馆失败',
          detail: errHome,
        });
      }
      // logger.debug(resHome);
      logger.debug('res.headers: \n', resHome.headers);
      logger.debug('res.header: ', '\n', resHome.header);
      const cookie = resHome.headers['set-cookie'];

      request
        .post(website.url.login)
        .send(data)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Cookie', cookie)
        .end((error, result) => {
          if (error) {
            logger.error('模拟登陆图书馆失败\n', error);
            return callback({
              code: 1017,
              error: '模拟登陆图书馆失败',
              detail: error,
            });
          }
          // logger.debug(result);
          const textStart = result.text.indexOf('<body');
          const textEnd = result.text.indexOf('</body');
          const text = result.text.substring(textStart, textEnd);
          if (text.indexOf(website.errorText.account) !== -1) {
            // 模拟登陆图书馆失败，学号或密码错误
            return callback({
              code: 1018,
              error: '模拟登陆图书馆失败，学号或密码错误',
            });
          }
          return callback(null, cookie);
        });
    });
}


module.exports = loginLib;
