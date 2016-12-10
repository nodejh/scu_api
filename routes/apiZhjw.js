// =====================
// 教务系统 API
// ======================
const express = require('express');
const log4js = require('./../config/log4js');
const generateToken = require('./../helpers/token').generate;
const UserModel = require('./../models/user');
const login = require('./../crawler/fetch/loginZhjw');
const fetchCurriculums = require('./../crawler/fetch/curriculums');
const analyseCurriculums = require('./../crawler/analyse/curriculums');


const logger = log4js.getLogger('/routes/apiZhjw');
const router = new express.Router();


/**
 * 模拟登陆教务系统
 */
router.get('/login/zhjw', (req, res) => {
  const number = req.query.number;
  const password = req.query.password;
  const token = generateToken(number);

  logger.debug('number && password\n', number, password);
  // 学号和密码校验
  if (!/^\d+$/.test(number)) {
    return res.json({
      code: 0,
      message: '登录教务系统URL传入number格式错误',
    });
  }
  if (!/^\d+$/.test(password)) {
    return res.json({
      code: 1042,
      message: '登录教务系统URL传入password格式错误',
    });
  }

  const user = {
    number,
    password,
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
      password,
      token,
      updatetime: new Date().getTime(),
    };
    return UserModel.update({ number }, { $set: userUpdate });
  }).then(() => {
    logger.debug('登录教务系统成功');
    return res.json({
      code: 0,
      msg: '登录教务系统成功',
      data: {
        token,
      },
    });
  })
    .catch((error) => {
      logger.debug('error: ', error);
      return res.json(error);
    });
});


/**
 * 获取课表
 */
router.get('/zhjw/curriculums', (req, res) => {
  const token = req.query.token;
  logger.debug('token: ', token);
  if (!token) {
    return res.json({
      code: 1050,
      error: '获取课表URL传入token参数错误',
    });
  }
  UserModel.find({ token })
    .then((result) => {
      logger.debug('result: ', result);
      if (result.length === 0) {
        return Promise.reject({
          code: 1051,
          error: '获取课表URL传入token无效',
        });
      }
      const number = result[0].number;
      const password = result[0].password;
      return login(number, password);
    }).then((cookie) => {
      logger.debug('cookie: ', cookie);
      return fetchCurriculums(cookie);
    }).then((dom) => {
      // logger.debug('dom: ', dom);
      const result = analyseCurriculums(dom);
      if (result.error) {
        return Promise.reject(result.error);
      }
      logger.debug('data: ', JSON.stringify(result.curriculums));
      return res.json({
        code: 0,
        data: {
          curriculums: JSON.stringify(result.curriculums),
        },
      });
    })
      .catch((error) => {
        logger.error('获取课表失败: ', error);
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


/**
 * 获取所有成绩并计算绩点
 */
// router.get('/get_grades', (req, res) => {
//   if (!req.session.cookieZhjw) {
//     return res.json({ code: 1010, error: '尚未登陆' });
//   }
//   const cookie = req.session.cookieZhjw;
//   getGrades(cookie, (error, data) => {
//     if (error) {
//       logger.error('获取课表失败\n', error);
//       return res.json({ error });
//     }
//     return res.json({
//       code: 0,
//       msg: '获取所有成绩并计算绩点成功',
//       grades: data.grades,
//     });
//   });
// });


module.exports = router;
