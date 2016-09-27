// 模拟登录
const request = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const regexp = require('./../lib/regexp');
const log4js = require('./../conf/log4js');
const website = require('./../conf/website');


const logger = log4js.getLogger('/models/login');
charset(request);


/**
 * 模拟登陆教务系统
 * @method login
 * @param  {string}   number   学号
 * @param  {string}   password 密码
 * @param  {Function} callback 登录成功后的回调函数
 * @return {object}   cookie   错误信息和cookie
 */
function login(number, password, callback) {
  logger.debug('number && password\n', number, password);

  if (!regexp.number.test(number)) {
    return callback({ code: 1001, error: '学号格式错误' });
  }

  if (!regexp.number.test(password)) {
    return callback({ code: 1002, error: '密码格式错误' });
  }

  // 模拟登陆教务系统
  request
  .get(`${website.url.login}?zjh=${number}&mm=${password}`)
  .charset('gbk')
  .end((errLogin, resLogin) => {
    if (errLogin) {
      logger.error('errLogin ', errLogin);
      return callback({
        code: 1003,
        error: '模拟登陆教务系统失败',
        detail: errLogin,
      });
    }

    // 判断是否登陆成功
    const $ = cheerio.load(resLogin.text, {
      ignoreWhitespace: true,
      xmlMode: false,
      lowerCaseTags: false,
    });
    const loginResText = $('body').text().replace(/\s+/g, '');
    if (loginResText.indexOf(website.errorText.account) !== -1) {
      if (loginResText.indexOf(website.errorText.number) !== -1) {
        return callback({ code: 1004, error: '学号错误' });
      }
      if (loginResText.indexOf(website.errorText.password) !== -1) {
        return callback({ code: 1005, error: '密码错误' });
      }
      return callback({ code: 1006, error: '学号或密码错误' });
    }

    const cookie = resLogin.header['set-cookie'];
    return callback(null, cookie);
  });
}


module.exports = login;
