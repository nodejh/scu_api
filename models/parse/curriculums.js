// 解析课表页面
const cheerio = require('cheerio');
const log4js = require('./../../conf/log4js');
const zhjwSpecialText = require('./zhjwSpecialText');

const logger = log4js.getLogger('/models/parse/curriculums');


const parseCurriculums = (html, callback) => {
  // logger.debug('html: ', html);
  const errSpecialText = zhjwSpecialText(html);
  logger.debug('errSpecialText: ', errSpecialText);
  if (errSpecialText) {
    return callback(errSpecialText);
  }
  const $ = cheerio.load(html, {
    ignoreWhitespace: true,
    xmlMode: false,
    lowerCaseTags: false,
  });
  const curriculumsTableTr = $('body').find('table[class="titleTop2"]').eq(1).find('.displayTag tr');
  logger.debug('curriculumsTableTr\n', curriculumsTableTr.text());
  const curriculums = [];
  curriculumsTableTr.each(function (index) {
    if (index > 0) {
      // 对一周上两节的课进行处理
      const trLength = $(this).find('td').length;
      logger.debug('11 trLength: ', trLength);
      if (trLength !== 6) {
        const weeks = $(this).find('td').eq(11).text()
                      .replace(/\s+/g, '')
                      .split('周'); // 周次
        weeks.pop();
        let newWeeks = [];
        if (weeks.length > 0) {
          if (weeks[0].indexOf('-')) {
            // weeks 是 1-17 这种格式
            const weekStart = parseInt(weeks[0].split('-')[0], 10);
            const weekEnd = parseInt(weeks[0].split('-')[1], 10);
            logger.debug('weekEnd: ', weekStart, weekEnd);
            for (let i = weekStart; i <= weekEnd; i += 1) {
              newWeeks.push(i);
            }
          } else {
            // weeks 是 2,4,6,8,10,12,14,16,18 这种格式
            newWeeks = weeks[0].split(',');
          }
        } else {
          newWeeks = [];
        }

        const session = $(this).find('td').eq(12).text()
                          .replace(/\s+/g, '');
        const newSession = [];
        if (session) {
          if (session[0].indexOf('~')) {
            // session 是 10~12 这种格式
            const sessionStart = parseInt(session[0].split('~')[0], 10);
            const sessionEnd = parseInt(session[0].split('~')[1], 10);
            logger.debug('weekEnd: ', sessionStart, sessionEnd);
            for (let i = sessionStart; i <= sessionEnd; i += 1) {
              newSession.push(i);
            }
          }
        }

        curriculums.push({
          courseNumber: $(this).find('td').eq(1).text()
            .replace(/\s+/g, ''), // 课程号
          courseName: $(this).find('td').eq(2).text()
              .replace(/(^\s+)|(\s+$)/g, ''), // 课程名
          lessonNumber: $(this).find('td').eq(3).text()
            .replace(/\s+/g, ''), // 课序号
          credit: $(this).find('td').eq(4).text()
              .replace(/\s+/g, ''), // 学分
          courseProperty: $(this).find('td').eq(5).text()
              .replace(/\s+/g, ''), // 课程属性
          examDate: $(this).find('td').eq(6).text()
              .replace(/\s+/g, ''), // 考试类型
          teachers: $(this).find('td').eq(7).text()
              .replace(/(^\s+)|(\*)|(\s+$)/g, ''), //  教师
          studyingWays: $(this).find('td').eq(9).text()
              .replace(/\s+/g, ''), //  修读方式
          courseStatus: $(this).find('td').eq(10).text()
              .replace(/\s+/g, ''), // 选课状态
          weeks: newWeeks, // 周次
          week: newSession, // 星期
          session: $(this).find('td').eq(13).text()
              .replace(/\s+/g, '')
              .split('~'), // 节次
          campus: $(this).find('td').eq(14).text()
              .replace(/\s+/g, ''), // 校区
          tachingBuilding: $(this).find('td').eq(15).text()
              .replace(/\s+/g, ''), // 教学楼
          classroom: $(this).find('td').eq(16).text()
              .replace(/\s+/g, ''), // 教室
        });
      } else {
        const weeks = $(this).find('td').eq(0).text()
                      .replace(/\s+/g, '')
                      .replace(/,/g, '-')
                      .split('周'); // 周次
        weeks.pop();
        let newWeeks = [];
        if (weeks.length > 0) {
          if (weeks[0].indexOf('-')) {
            // weeks 是 1-17 这种格式
            const weekStart = parseInt(weeks[0].split('-')[0], 10);
            const weekEnd = parseInt(weeks[0].split('-')[1], 10);
            logger.debug('weekEnd: ', weekStart, weekEnd);
            for (let i = weekStart; i <= weekEnd; i += 1) {
              newWeeks.push(i);
            }
          } else {
            // weeks 是 2,4,6,8,10,12,14,16,18 这种格式
            newWeeks = weeks[0].split(',');
          }
        } else {
          newWeeks = [];
        }
        curriculums.push({
          courseNumber: curriculums[index - 2].courseNumber, // 课程号
          courseName: curriculums[index - 2].courseName, // 课程名
          lessonNumber: curriculums[index - 2].lessonNumber, // 课序号
          credit: curriculums[index - 2].credit, // 学分
          courseProperty: curriculums[index - 2].courseProperty, // 课程属性
          examDate: curriculums[index - 2].examDate, // 考试类型
          teachers: curriculums[index - 2].teachers, //  教师
          studyingWays: curriculums[index - 2].studyingWays, //  修读方式
          courseStatus: curriculums[index - 2].courseStatus, // 选课状态
          weeks: newWeeks, // 周次
          week: $(this).find('td').eq(1).text()
              .replace(/\s+/g, ''), // 星期
          session: $(this).find('td').eq(2).text()
              .replace(/\s+/g, '')
              .split('~'), // 节次
          campus: $(this).find('td').eq(3).text()
              .replace(/\s+/g, ''), // 校区
          tachingBuilding: $(this).find('td').eq(4).text()
              .replace(/\s+/g, ''), // 教学楼
          classroom: $(this).find('td').eq(5).text()
              .replace(/\s+/g, ''), // 教室
        });
      }
    }
  });
  logger.debug('curriculums\n', JSON.stringify(curriculums));
  return callback(null, { curriculums });
};


module.exports = parseCurriculums;
