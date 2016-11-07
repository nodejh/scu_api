// =====================
// 图书馆 API
// ======================
const express = require('express');
const log4js = require('./../config/log4js');
const generateToken = require('./../helpers/token').generate;
const UserModel = require('./../models/user');
const login = require('./../crawler/fetch/loginLib');
// const fetchCurriculums = require('./../crawler/fetch/curriculums');
// const analyseCurriculums = require('./../crawler/analyse/curriculums');
// const getGrades = require('./../models/getGrades');


const logger = log4js.getLogger('/routes/apiLib');
const router = new express.Router();


/**
 * 模拟登陆图书馆系统
 */
router.get('/login/lib', (req, res) => {
  const number = req.query.number;
  const password = req.query.password;
  const token = generateToken(number + password);

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
    return res.json({ code: 0, msg: '登录图书馆系统成功', token });
  })
    .catch((error) => {
      logger.debug('error: ', error);
      return res.json(error);
    });
});


/**
 * 获取课表
 */
// router.get('/zhjw/curriculums', (req, res) => {
//   const key = req.query.key;
//   const token = req.query.token;
//   if (!key) {
//     return res.json({
//       code: 1049,
//       error: '获取课表URL传入key参数错误',
//     });
//   }
//   if (!token) {
//     return res.json({
//       code: 1050,
//       error: '获取课表URL传入token参数错误',
//     });
//   }
//   const auth = { key, token };
//   getCurriculums(auth, (error, data) => {
//     if (error) {
//       logger.error('获取课表失败: ', error);
//       return res.json(error);
//     }
//     logger.debug('data: ', JSON.stringify(data));
//     res.json({
//       code: 0,
//       data,
//     });
//   });
// });

module.exports = router;
