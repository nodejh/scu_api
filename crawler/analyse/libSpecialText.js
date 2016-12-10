// 解析图书馆系统所抓取页面的特殊的字符串
// 如未登录时访问出错的提示，cookie信息过期的提示，服务器错误的提示等
const website = require('./../../config/website').lib;
const log4js = require('./../../config/log4js');


const logger = log4js.getLogger('/models/parse/libSpecialText');


/**
 * 判断移动图书馆系统是否登录过期
 * 判断是否有信息提示(请确认您的浏览器Cookie开启和正常访问移动图书馆首页)
 * 未登录
 * @method cookieTips
 * @param  {string}   html 抓取到的html
 * @return {object}   错误信息
 */
const libCookieTips = (html) => {
  if (html.indexOf(website.errorText.cookieTips) !== -1) {
    logger.error(website.errorText.cookieTips);
    return {
      code: 1027,
      error: '移动图书馆系统 cookie 信息过期，请重新登录',
      detail: html,
    };
  }
  return null;
};


module.exports = {
  libCookieTips,
};
