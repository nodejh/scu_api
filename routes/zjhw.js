// =====================
// 教务系统 API
// ======================
const express = require('express');
const log4js = require('./../conf/log4js');
const loginZhjw = require('./../models/loginZhjw');
const getCurriculums = require('./../models/getCurriculums');
const getGrades = require('./../models/getGrades');


const logger = log4js.getLogger('/routes/api');
const router = new express.Router();


/**
 * 模拟登陆教务系统
 */
router.post('/login_zhjw', (req, res) => {
  const number = req.body.number;
  const password = req.body.password;
  loginZhjw(number, password, (error, cookie) => {
    if (error) {
      logger.error('模拟登陆教务系统失败\n', error);
      return res.json({ error });
    }

    req.session.cookieZhjw = cookie;
    logger.debug('session\n', req.session);
    return res.json({ code: 0, msg: '登录教务系统成功' });
  });
});


/**
 * 获取课表
 */
router.get('/get_curriculums', (req, res) => {
  if (!req.session.cookieZhjw) {
    return res.json({ code: 1010, error: '尚未登陆' });
  }
  const cookie = req.session.cookieZhjw;
  getCurriculums(cookie, (error, data) => {
    if (error) {
      logger.error('获取课表失败\n', error);
      return res.json({ error });
    }
    return res.json({
      code: 0,
      msg: '获取课表成功',
      curriculums: data.curriculums,
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
