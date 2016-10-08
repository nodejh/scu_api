// =====================
// 教务系统 API
// ======================
const express = require('express');
const config = require('./../conf/config');
const log4js = require('./../conf/log4js');
const regexp = require('./../libs/regexp');
const login = require('./../models/login/zhjw');
const encrypt = require('./../libs/encrypt');
const getCurriculums = require('./../controller/getCurriculums');
const getGrades = require('./../models/getGrades');


const logger = log4js.getLogger('/routes/zhjw');
const router = new express.Router();


/**
 * 模拟登陆教务系统
 */
router.get('/login/zhjw', (req, res) => {
  const number = req.query.number;
  const password = req.query.password;
  // 验证 number
  logger.debug('number && password\n', number, password);
  if (!regexp.number.test(number)) {
    return res.json({ code: 1041, error: '登录教务系统URL传入number格式错误' });
  }
  // 验证 password
  if (!regexp.number.test(password)) {
    return res.json({ code: 1042, error: '登录教务系统URL传入password格式错误' });
  }
  login(number, password, (error, cookie) => {
    if (error) {
      logger.error('模拟登陆教务系统失败\n', error);
      return res.json(error);
    }
    logger.debug('cookie: ', cookie);
    const key = encrypt.getRandomKey(config.encrypt.size);
    const algorithm = config.encrypt.algorithm;
    const token = encrypt.cipher(algorithm, key, cookie);
    return res.json({ code: 0, msg: '登录教务系统成功', key, token });
  });
});


/**
 * 获取课表
 */
router.get('/zhjw/curriculums', (req, res) => {
  const key = req.query.key;
  const token = req.query.token;
  if (!key) {
    return res.json({
      code: 1049,
      error: '获取课表URL传入key参数错误',
    });
  }
  if (!token) {
    return res.json({
      code: 1050,
      error: '获取课表URL传入token参数错误',
    });
  }
  const auth = { key, token };
  getCurriculums(auth, (error, data) => {
    if (error) {
      logger.error('获取课表失败: ', error);
      return res.json(error);
    }
    logger.debug('data: ', JSON.stringify(data));
    res.json({
      code: 0,
      data,
    });
  });
});


/**
 * 获取所有成绩并计算绩点
 */
router.get('/get_grades', (req, res) => {
  if (!req.session.cookieZhjw) {
    return res.json({ code: 1010, error: '尚未登陆' });
  }
  const cookie = req.session.cookieZhjw;
  getGrades(cookie, (error, data) => {
    if (error) {
      logger.error('获取课表失败\n', error);
      return res.json({ error });
    }
    return res.json({
      code: 0,
      msg: '获取所有成绩并计算绩点成功',
      grades: data.grades,
    });
  });
});


module.exports = router;
