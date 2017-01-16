const express = require('express');
// const log4js = require('./../config/log4js');
// const generateToken = require('./../helpers/token').generate;
// const regexp = require('./../models/regexp');
// const login = require('./../models/login/zhjw');
// const encrypt = require('./../models/encrypt');
// const getCurriculums = require('./../controller/getCurriculums');
// const getGrades = require('./../models/getGrades');


// const logger = log4js.getLogger('/routes/zhjw');
const router = new express.Router();


router.get('/', (req, res) => {
  console.log('d');
  return res.json({ a: 'a' });
});

module.exports = router;
