// =====================
// 图书馆 API
// ======================
const express = require('express');
const log4js = require('./../config/log4js');
const generateToken = require('./../helpers/token').generate;
const UserModel = require('./../models/user');
const login = require('./../crawler/fetch/loginLib');
const fetchBookLendingList = require('./../crawler/fetch/bookLendingList');
const analyseBookLendingList = require('./../crawler/analyse/bookLendingList');
// const getGrades = require('./../models/getGrades');


const logger = log4js.getLogger('/routes/apiLib');
const router = new express.Router();


/**
 * 模拟登陆图书馆系统
 */
router.get('/login/lib', (req, res) => {
  const number = req.query.number;
  const password = req.query.password;
  const token = generateToken(number);
  logger.debug('number && password\n', number, password);
  // 学号和密码校验
  if (!/^\d+$/.test(number)) {
    return res.json({
      code: 0,
      message: '登录图书馆系统URL传入number格式错误',
    });
  }
  if (!/^\d+$/.test(password)) {
    return res.json({
      code: 1042,
      message: '登录图书馆系统URL传入password格式错误',
    });
  }

  const user = {
    number,
    password_lib: password,
    token,
    datetime: new Date().getTime(),
  };

  // 模拟登录
  login(number, password).then((result) => {
    logger.debug('cookie: ', result);
    // 判断数据库中是否已经存在该用户
    return UserModel.find({ number });
  }).then((result) => {
    // 不存在，存储用户信息
    if (result.length === 0) {
      return UserModel.insert(user);
    }
    // 已经存在，更新用户信息
    const userUpdate = {
      number,
      password_lib: password,
      token,
      updatetime: new Date().getTime(),
    };
    return UserModel.update({ number }, { $set: userUpdate });
  }).then(() => {
    logger.debug('登录图书馆系统成功');
    return res.json({
      code: 0,
      msg: '登录图书馆系统成功',
      data: { token },
    });
  })
    .catch((error) => {
      logger.debug('error: ', error);
      return res.json(error);
    });
});


/**
 * 图书借阅列表
 */
router.get('/lib/book_lending_list', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.json({
      code: 1050,
      error: '获取图书借阅列表URL传入token参数错误',
    });
  }
  UserModel.find({ token })
    .then((result) => {
      logger.debug('result: ', result);
      if (result.length === 0) {
        return Promise.reject({
          code: 1051,
          error: '获取图书借阅列表URL传入token无效',
        });
      }
      const number = result[0].number;
      const password = result[0].password_lib;
      return login(number, password);
    }).then((cookie) => {
      // logger.debug('result: ', result);
      logger.debug('cookie: ', cookie);
      return fetchBookLendingList(cookie);
    }).then((dom) => {
      // logger.debug('dom: ', dom);
      const result = analyseBookLendingList(dom);
      if (result.error) {
        return Promise.reject(result.error);
      }
      logger.debug('data: ', JSON.stringify(result.curriculums));
      return res.json({
        code: 0,
        data: {
          books: JSON.stringify(result.books),
          number: result.booksNumber,
        },
      });
    })
      .catch((error) => {
        logger.error('获取课表失败: ', error);
        return res.json(error);
      });
});

module.exports = router;
