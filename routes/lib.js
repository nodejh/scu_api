// =============================
// 图书馆 API Router
// =============================
const express = require('express');
const config = require('./../conf/config');
const log4js = require('./../conf/log4js');
const login = require('./../models/login/lib');
const encrypt = require('./../libs/encrypt');
const regexp = require('./../libs/regexp');
const booksLend = require('./../controller/lib/booksLend');


const logger = log4js.getLogger('/routes/lib');
const router = new express.Router();


/**
 * 模拟登录图书馆
 */
router.get('/login/lib', (req, res) => {
  const number = req.query.number;
  const password = req.query.password;
  // 验证 number
  logger.debug('number && password\n', number, password);
  if (!regexp.number.test(number)) {
    return res.json({ code: 1016, error: '登录移动图书馆学号格式错误' });
  }
  // 验证 password
  if (!regexp.number.test(password)) {
    return res.json({ code: 1017, error: '登录移动图书馆密码格式错误' });
  }
  login(number, password, (error, cookie) => {
    if (error) {
      logger.error('模拟登陆图书馆失败\n', error);
      return res.json(error);
    }
    logger.debug('cookie: ', cookie);
    const key = encrypt.getRandomKey(config.encrypt.size);
    const algorithm = config.encrypt.algorithm;
    const token = encrypt.cipher(algorithm, key, cookie);
    return res.json({ code: 0, message: '登录图书馆系统成功', key, token });
  });
});


/**
 * 获取借阅列表
 */
router.get('/lib/books_lend', (req, res) => {
  const key = req.query.key;
  const token = req.query.token;
  if (!key) {
    return res.json({
      code: 1022,
      error: '获取图书借阅列表URL传入key参数错误',
    });
  }
  if (!token) {
    return res.json({
      code: 1023,
      error: '获取图书借阅列表URL传入token参数错误',
    });
  }
  const auth = { key, token };
  booksLend(auth, (error, books) => {
    if (error) {
      logger.debug(error);
      return res.json(error);
    }
    logger.debug('books: ', books);
    res.json({
      code: 0,
      data: books,
    });
  });
});

module.exports = router;
