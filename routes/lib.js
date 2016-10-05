// =====================
// 图书馆 API
// ======================
const express = require('express');
const log4js = require('./../conf/log4js');
const login = require('./../models/login/lib');


const logger = log4js.getLogger('/routes/lib');
const router = new express.Router();


/**
 * 模拟登录图书馆
 * @type {[type]}
 */
router.post('/login/lib', (req, res) => {
  const number = req.body.number;
  const password = req.body.password;
  login(number, password, (error, cookie) => {
    if (error) {
      logger.error('模拟登陆图书馆失败\n', error);
      return res.json({ error });
    }
    logger.debug(cookie);
    req.session.cookieLib = cookie;
    return res.json({ code: 0, msg: '登录图书馆系统成功', token: cookie });
  });
});


module.exports = router;
