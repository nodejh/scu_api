// 成绩查询
const request = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const EventProxy = require('eventproxy');
const log4js = require('./../conf/log4js');
const website = require('./../conf/website');
const caculate = require('./calculateGpa').caculate;


const logger = log4js.getLogger('/models/getCurriculums');
const ep = new EventProxy();
charset(request);


/**
 * 抓取所有成绩并计算绩点
 * @method getGrades
 * @param  {string}   cookie   登录成功后的cookie
 * @param  {Function} callback 抓取成功后的回调函数
 * @return {object}   data     所有成绩及绩点
 */
function getGrades(cookie, callback) {
  if (!cookie) {
    return callback({ code: 1012, error: '尚未登陆' });
  }
  // 抓取到所有结果之后，执行下面的代码
  ep.all('currentTerm', 'allPass', 'allFail', (currentTerm, allPass, allFail) => {
    if (currentTerm[0]) {
      return callback({ code: 1013, error: '获取当前学期成绩错误' });
    }
    if (allPass[0]) {
      return callback({ code: 1014, error: '获取所有及格成绩错误，请重试' });
    }
    if (allFail[0]) {
      return callback({ code: 1015, error: '获取所有不及格成绩错误，请重试' });
    }

    return callback(null, {
      code: 0,
      grades: {
        currentTerm: currentTerm[1],
        allPass: allPass[1],
        allFail: allFail[1],
      },
    });
  });

  // 抓取本学期成绩页面
  request
  .get(website.url.currentTerm)
  .charset('gbk')
  .set('Cookie', cookie)
  .end((errCurrentTerm, resCurrentTerm) => {
    if (errCurrentTerm) {
      logger.error('抓取本学期成绩页面错误\n', errCurrentTerm);
      ep.emit('currentTerm', [errCurrentTerm, resCurrentTerm]);
    } else {
      const currentTermStart = resCurrentTerm.text.indexOf('<body');
      const currentTermEnd = resCurrentTerm.text.indexOf('</body');
      const currentTermText = resCurrentTerm.text.substring(currentTermStart, currentTermEnd);
      const $ = cheerio.load(currentTermText, {
        ignoreWhitespace: true,
        xmlMode: false,
        lowerCaseTags: false,
      });
      if (currentTermText.indexOf(website.errorText.database) !== -1) {
        // 抓取失败，数据库忙，需要重新登陆抓取
        ep.emit('currentTerm', [website.errorText.database, resCurrentTerm]);
      } else {
        const gradeTableTr = $('body').find('table[width="100%"]').eq(5).find('tr');
        const lengthGradeTableTr = gradeTableTr.length;
        const currentTermGrade = {}; // 本学期成绩
        currentTermGrade.gradeList = [];
        gradeTableTr.each(function (index) {
          // 排除表格行 tr 的第一项和最后一项
          if (index > 0 && index < lengthGradeTableTr - 1) {
            // console.log('===', index, $(this).find('td').eq(0).text());
            currentTermGrade.gradeList.push({
              courseNumber: $(this).find('td').eq(0).text()
                .replace(/\s+/g, ''), // 课程号
              lessonNumber: $(this).find('td').eq(1).text()
                .replace(/\s+/g, ''), // 课序号
              courseName: $(this).find('td').eq(2).text()
                .replace(/(^\s+)|(\s+$)/g, ''), // 课程名
              courseEnglishName: $(this).find('td').eq(3).text()
                .replace(/(^\s+)|(\s+$)/g, ''), // 英文课程名
              credit: $(this).find('td').eq(4).text()
                .replace(/\s+/g, ''), // 学分
              courseProperty: $(this).find('td').eq(5).text()
                .replace(/\s+/g, ''), // 课程属性
              grade: $(this).find('td').eq(6).text()
                .replace(/\s+/g, ''), // 成绩
            });
          }
        });
        // console.log('currentTermGrade: ', caculate(currentTermGrade.gradeList));
        // 获取绩点计算结果
        const caculateResult = caculate(currentTermGrade.gradeList);
        currentTermGrade.averageGpa = caculateResult.averageGpa;
        currentTermGrade.averageGrade = caculateResult.averageGrade;
        currentTermGrade.averageGpaObligatory = caculateResult.averageGpaObligatory;
        currentTermGrade.averageGradeObligatory = caculateResult.averageGradeObligatory;
        currentTermGrade.sumCredit = caculateResult.sumCredit;
        currentTermGrade.sumCreditObligatory = caculateResult.sumCreditObligatory;
        ep.emit('currentTerm', [errCurrentTerm, currentTermGrade]);
      }
    }
  });

  // 抓取所有及格成绩
  request
  .get(website.url.allPass)
  .charset('gbk')
  .set('Cookie', cookie)
  .end((errAllPass, resAllPass) => {
    logger.debug('抓取所有及格成绩...');
    if (errAllPass) {
      logger.error('抓取所有及格成绩错误\n', errAllPass);
      ep.emit('allPass', [errAllPass, resAllPass]);
    } else {
      const allPassStart = resAllPass.text.indexOf('<body');
      const allPassEnd = resAllPass.text.indexOf('</body');
      const allPassText = resAllPass.text.substring(allPassStart, allPassEnd);
      const $ = cheerio.load(allPassText, {
        ignoreWhitespace: true,
        xmlMode: false,
        lowerCaseTags: false,
      });
      if (allPassText.indexOf(website.errorText.database) !== -1) {
        // 抓取失败，数据库忙，需要重新登陆抓取
        ep.emit('allPass', [website.errorText.database, allPassText]);
      } else {
        const gradeTable = $('body').find('table[class="titleTop2"]');
        const allPassGradeList = [];
        // allPassGradeList.gradeList = []; // 成绩列表
        gradeTable.each(function () {
          // 获取每一学期成绩
          // console.log($(this).prev().prev().text());
          const gradeList = {};
          gradeList.term = $(this).prev().prev().text()
                            .replace(/\s+/g, '');
          gradeList.list = [];
          const gradeTableTr = $(this).find('table[id="user"] tr');
          gradeTableTr.each(function (index) {
          // 获取每一学期成绩中的每一项成绩
            if (index > 0) {
              gradeList.list.push({
                courseNumber: $(this).find('td').eq(0).text()
                  .replace(/\s+/g, ''), // 课程号
                lessonNumber: $(this).find('td').eq(1).text()
                  .replace(/\s+/g, ''), // 课序号
                courseName: $(this).find('td').eq(2).text()
                  .replace(/(^\s+)|(\s+$)/g, ''), // 课程名
                courseEnglishName: $(this).find('td').eq(3).text()
                  .replace(/(^\s+)|(\s+$)/g, ''), // 英文课程名
                credit: $(this).find('td').eq(4).text()
                  .replace(/\s+/g, ''), // 学分
                courseProperty: $(this).find('td').eq(5).text()
                  .replace(/\s+/g, ''), // 课程属性
                grade: $(this).find('td').eq(6).text()
                  .replace(/\s+/g, ''), // 成绩
              });
            }
          });
          // 获取绩点计算结果
          const caculateResult = caculate(gradeList.list);
          gradeList.averageGpa = caculateResult.averageGpa;
          gradeList.averageGrade = caculateResult.averageGrade;
          gradeList.averageGpaObligatory = caculateResult.averageGpaObligatory;
          gradeList.averageGradeObligatory = caculateResult.averageGradeObligatory;
          gradeList.sumCredit = caculateResult.sumCredit;
          gradeList.sumCreditObligatory = caculateResult.sumCreditObligatory;
          allPassGradeList.push(gradeList);
        });
        ep.emit('allPass', [errAllPass, allPassGradeList]);
      }
    }
  });

  // 抓取所有不及格成绩
  request
  .get(website.url.allFail)
  .charset('gbk')
  .set('Cookie', cookie)
  .end((errAllFail, resAllFail) => {
    if (errAllFail) {
      logger.error('抓取所有及格成绩错误\n', errAllFail);
      ep.emit('allFail', [errAllFail, resAllFail]);
    } else {
      const allFailStart = resAllFail.text.indexOf('<body');
      const allFailEnd = resAllFail.text.indexOf('</body');
      const allFailText = resAllFail.text.substring(allFailStart, allFailEnd);
      const $ = cheerio.load(allFailText, {
        ignoreWhitespace: true,
        xmlMode: false,
        lowerCaseTags: false,
      });
      // console.log('===========allFailText: ', allFailText);
      if (allFailText.indexOf(website.errorText.database) !== -1) {
        // 抓取失败，数据库忙，需要重新登陆抓取
        ep.emit('allFail', [website.errorText.database, allFailText]);
      } else {
        const currentFailTableTr = $('body').find('table[class="titleTop2"]').eq(0).find('table[id="user"] tr');
        const beforeFailTableTr = $('body').find('table[class="titleTop2"]').eq(1).find('table[id="user"] tr');
        const allFailGradeList = {};
        allFailGradeList.current = []; // 尚不及格
        allFailGradeList.before = []; // 曾不及格
        currentFailTableTr.each(function (index) {
          // console.log('currentFailTableTr: ', $(this).text());
          if (index > 0) {
            allFailGradeList.current.push({
              courseNumber: $(this).find('td').eq(0).text()
                .replace(/\s+/g, ''), // 课程号
              lessonNumber: $(this).find('td').eq(1).text()
                .replace(/\s+/g, ''), // 课序号
              courseName: $(this).find('td').eq(2).text()
                .replace(/(^\s+)|(\s+$)/g, ''), // 课程名
              courseEnglishName: $(this).find('td').eq(3).text()
                .replace(/(^\s+)|(\s+$)/g, ''), // 英文课程名
              credit: $(this).find('td').eq(4).text()
                .replace(/\s+/g, ''), // 学分
              courseProperty: $(this).find('td').eq(5).text()
                .replace(/\s+/g, ''), // 课程属性
              grade: $(this).find('td').eq(6).text()
                .replace(/\s+/g, ''), // 成绩
              examDate: $(this).find('td').eq(7).text()
                .replace(/\s+/g, ''), // 考试时间
              failReason: $(this).find('td').eq(8).text()
                .replace(/\s+/g, ''), // 未通过原因
            });
          }
        });
        beforeFailTableTr.each(function (index) {
          if (index > 0) {
            allFailGradeList.before.push({
              courseNumber: $(this).find('td').eq(0).text()
                .replace(/\s+/g, ''), // 课程号
              lessonNumber: $(this).find('td').eq(1).text()
                .replace(/\s+/g, ''), // 课序号
              courseName: $(this).find('td').eq(2).text()
                .replace(/\s+/g, ''), // 课程名
              courseEnglishName: $(this).find('td').eq(3).text()
                .replace(/(^\s+)|(\s+$)/g, ''), // 英文课程名
              credit: $(this).find('td').eq(4).text()
                .replace(/\s+/g, ''), // 学分
              courseProperty: $(this).find('td').eq(5).text()
                .replace(/\s+/g, ''), // 课程属性
              grade: $(this).find('td').eq(6).text()
                .replace(/\s+/g, ''), // 成绩
              examDate: $(this).find('td').eq(7).text()
                .replace(/\s+/g, ''), // 考试时间
              failReason: $(this).find('td').eq(8).text()
                .replace(/\s+/g, ''), // 未通过原因
            });
          }
        });
        ep.emit('allFail', [errAllFail, allFailGradeList]);
      }
    }
  });
}


module.exports = getGrades;
