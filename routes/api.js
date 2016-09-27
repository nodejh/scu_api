const express = require('express');
const log4js = require('./../conf/log4js');
const login = require('./../models/login');
const getCurriculums = require('./../models/getCurriculums');
const getGrades = require('./../models/getGrades');


const logger = log4js.getLogger('/routes/api');
const router = new express.Router();


/**
 * 模拟登陆
 */
router.post('/login', (req, res) => {
  const number = req.body.number;
  const password = req.body.password;
  login(number, password, (error, cookie) => {
    if (error) {
      logger.error('模拟登陆失败\n', error);
      return res.json({ error });
    }

    req.session.user = { cookie, number, password };
    logger.debug('session\n', req.session);
    return res.json({ code: 0, msg: '登录成功' });
  });
});


/**
 * 获取课表
 */
router.get('/get_curriculums', (req, res) => {
  if (!req.session.user) {
    return res.json({ code: 1010, error: '尚未登陆' });
  }

  const cookie = req.session.user.cookie;
  if (!req.session.user.cookie) {
    return res.json({ code: 1010, error: '尚未登陆' });
  }

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
  if (!req.session.user) {
    return res.json({ code: 1010, error: '尚未登陆' });
  }

  const cookie = req.session.user.cookie;
  if (!req.session.user.cookie) {
    return res.json({ code: 1010, error: '尚未登陆' });
  }

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


// 获取课表
module.exports = router;
