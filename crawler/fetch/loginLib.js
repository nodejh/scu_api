// ============================
// 模拟登录图书馆
// ============================
const request = require('request');
const config = require('./../../config/config');
const log4js = require('./../../config/log4js');
const website = require('./../../config/website').lib;


const logger = log4js.getLogger('/models/loginLib');


/**
 * 获取 cookie
 * @param  {object} options HTTP请求设置信息
 * @return {promise}         cookie
 */
const getCookie = (options) => {
  logger.debug('options: ', options);
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject({ error, code: 1018 });
      }
      const cookie = response.headers['set-cookie'].join();
      resolve(cookie);
    });
  });
};


/**
 * 模拟登录操作
 * 模拟登录判断登录是否成功
 * @param  {object} options HTTP请求信息
 * @return {promise}        登录成功后的cookie
 */
const doLogin = (options) => {
  logger.debug('doLogin() options: ', options);
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject({ error, code: 1012 });
      }
      if (body.indexOf(website.errorText.account) !== -1) {
        reject({
          error: website.errorText.account,
          code: 1019,
        });
      }
      if (body.indexOf(website.errorText.emptyPassword) !== -1) {
        reject({
          error: website.errorText.emptyPassword,
          code: 1020,
        });
      }
      if (body.indexOf(website.errorText.emptyNumber) !== -1) {
        reject({
          error: website.errorText.emptyNumber,
          code: 1021,
        });
      }
      const cookieLogined = response.headers['set-cookie'].join();
      resolve(cookieLogined);
    });
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
const login = (number, password) => {
  logger.debug('login: ', number, password);
  return new Promise((resolve, reject) => {
    // 获取图书馆首页cookie
    getCookie({ url: website.url.home })
      .then((cookie) => {
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
            Cookie: cookie,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': config.crawler['User-Agent'],
          },
          method: 'POST',
        };
        return doLogin(options);
      }).then((cookie) => {
        logger.debug('cookie: ', cookie);
        resolve(cookie);
      }).catch((error) => {
        reject(error);
      });
  });
};


module.exports = login;
