// ============================
// 模拟登录教务系统
// ============================
const request = require('request');
const iconv = require('iconv-lite');
const config = require('./../../config/config');
const log4js = require('./../../config/log4js');
const website = require('./../../config/website').zhjw;


const logger = log4js.getLogger('/models/login/zhjw');


/**
 * 模拟登陆教务系统
 * @method login
 * @param  {string}   number   学号
 * @param  {string}   password 密码
 * @param  {Function} callback 登录成功后的回调函数
 * @return {object}   cookie   错误信息和cookie
 */
// function login(number, password, callback) {
//   logger.debug('number && password\n', number, password);
//   // 模拟登陆教务系统
//   const options = {
//     url: `${website.url.login}?zjh=${number}&mm=${password}`,
//     encoding: null,
//     headers: {
//       'User-Agent': config.crawler['User-Agent'],
//     },
//   };
//   request(options, (error, response, body) => {
//     if (error) {
//       logger.error('error ', error);
//       return callback({
//         code: 1003,
//         error: '模拟登陆教务系统失败',
//         detail: error,
//       });
//     }
//     if (response.statusCode !== 200) {
//       logger.error('error response: ', response);
//       return callback({
//         code: 1043,
//         error: '模拟登陆教务系统失败，响应头状态码不是200',
//         detail: response,
//       });
//     }
//     const content = iconv.decode(body, 'GBK');
//     logger.debug('content: ', content);
//     if (body.indexOf(website.errorText.account) !== -1) {
//       if (body.indexOf(website.errorText.number) !== -1) {
//         return callback({ code: 1004, error: '学号错误' });
//       }
//       if (body.indexOf(website.errorText.password) !== -1) {
//         return callback({ code: 1005, error: '密码错误' });
//       }
//       return callback({ code: 1006, error: '学号或密码错误' });
//     }
//
//     const cookie = response.headers['set-cookie'].join();
//     return callback(null, cookie);
//   });
// }
/**
 * 模拟登陆教务系统
 * @method login
 * @param  {string}   number   学号
 * @param  {string}   password 密码
 * @param  {Function} callback 登录成功后的回调函数
 * @return {promise}           错误信息或cookie
 */
function login(number, password) {
  logger.debug('number && password\n', number, password);
  return new Promise((resolve, reject) => {
    // 模拟登陆教务系统
    const options = {
      url: `${website.url.login}?zjh=${number}&mm=${password}`,
      encoding: null,
      headers: {
        'User-Agent': config.crawler['User-Agent'],
      },
    };
    request(options, (error, response, body) => {
      if (error) {
        logger.error('error ', error);
        reject({
          code: 1003,
          error: '模拟登陆教务系统失败',
          detail: error,
        });
      }
      if (response.statusCode !== 200) {
        logger.error('error response: ', response);
        reject({
          code: 1043,
          error: '模拟登陆教务系统失败，响应头状态码不是200',
          detail: response,
        });
      }
      const content = iconv.decode(body, 'GBK');
      logger.debug('content: ', content);
      if (body.indexOf(website.errorText.account) !== -1) {
        if (body.indexOf(website.errorText.number) !== -1) {
          reject({ code: 1004, error: '学号错误' });
        }
        if (body.indexOf(website.errorText.password) !== -1) {
          reject({ code: 1005, error: '密码错误' });
        }
        reject({ code: 1006, error: '学号或密码错误' });
      }

      const cookie = response.headers['set-cookie'].join();
      resolve({ cookie });
    });
  });
}

module.exports = login;
