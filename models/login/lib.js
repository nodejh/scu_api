// ============================
// 模拟登录图书馆
// ============================
const request = require('request');
const regexp = require('./../../libs/regexp');
const log4js = require('./../../conf/log4js');
const website = require('./../../conf/website').lib;


const logger = log4js.getLogger('/models/loginLib');


/**
 * 获取 cookie
 * @method getCookie
 * @param  {object}   options  HTTP请求设置信息
 * @param  {Function} callback
 * @return {string}   {error, HTTP响应中的cookie}
 */
const getCookie = (options, callback) => {
  request(options, (error, response) => {
    if (error) {
      return callback({ error, code: 1018 });
    }
    const cookie = response.headers['set-cookie'].join();
    return callback(null, cookie);
  });
};


/**
 * 模拟登录操作
 * @method doLogin
 * @param  {object}   options  HTTP 请求信息
 * @param  {string}   cookie   cookie
 * @param  {Function} callback 回调函数
 * @return {object}   {error, 登录成功后的cookie}
 */
const doLogin = (options, callback) => {
  request(options, (error, response, body) => {
    if (error) {
      return callback({ error });
    }
    if (body.indexOf(website.errorText.account) !== -1) {
      return callback({
        error: website.errorText.account,
        code: 1019,
      });
    }
    if (body.indexOf(website.errorText.emptyPassword) !== -1) {
      return callback({
        error: website.errorText.emptyPassword,
        code: 1020,
      });
    }
    if (body.indexOf(website.errorText.emptyNumber) !== -1) {
      return callback({
        error: website.errorText.emptyNumber,
        code: 1021,
      });
    }
    const cookieLogined = response.headers['set-cookie'].join();
    return callback(null, cookieLogined);
  });
};


/**
 * 模拟登录
 * @method login
 * @param  {string}   number   学号（借阅证号）
 * @param  {string}   password 密码
 * @param  {Function} callback 回调函数
 * @return {object}   登录成功后的cookie
 */
const login = (number, password, callback) => {
  // 验证 number
  logger.debug('number && password\n', number, password);
  if (!regexp.number.test(number)) {
    return callback({ code: 1016, error: '登录移动图书馆学号格式错误' });
  }
  // 验证 password
  if (!regexp.number.test(password)) {
    return callback({ code: 1017, error: '登录移动图书馆密码格式错误' });
  }
  // 获取图书馆首页 cookie
  getCookie({ url: website.url.home }, (errHome, cookieHome) => {
    if (errHome) {
      logger.error('获取图书馆首页 cookie 失败: \n', errHome);
      return callback({
        code: errHome.code,
        error: errHome.error,
      });
    }
    logger.debug('首页cookie:\n ', cookieHome);
    // 模拟登录
    const options = {
      url: website.url.login,
      form: {
        schoolid: website.schoolid,
        backurl: '',
        userType: 0,
        username: number,
        password,
      },
      headers: {
        Cookie: cookieHome,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    };
    doLogin(options, (errLogin, cookieLogined) => {
      if (errLogin) {
        logger.error('登录失败: \n', errLogin);
        return callback({
          code: errLogin.code,
          error: errLogin.error,
        });
      }
      logger.debug('登录成功后的 cookie:\n ', cookieLogined);
      return callback(null, cookieLogined);
    });
  });
};


module.exports = login;
