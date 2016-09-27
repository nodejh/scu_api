// 和爬取网站相关的配置，不需要修改
const config = {
  url: {
    login: 'http://202.115.47.141/loginAction.do', // 登陆页面
    curriculums: 'http://202.115.47.141/xkAction.do?actionType=6', // 课表页面
    // 本学期成绩。pageSize=100 参数主要是为了将所有成绩都显示在一页
    currentTerm: 'http://202.115.47.141/bxqcjcxAction.do?pageSize=100',
    allPass: 'http://202.115.47.141/gradeLnAllAction.do?type=ln&oper=qbinfo', // 所有及格成绩
    allFail: 'http://202.115.47.141/gradeLnAllAction.do?type=ln&oper=bjg', // 全部不及格成绩
  },
  errorText: {
    account: '帐号', // 只要模拟登陆后返回的页面中有 ‘帐号’ 两个字，说明登陆失败
    number: '你输入的证件号不存在，请您重新输入！',
    password: '您的密码不正确，请您重新输入！',
    database: '数据库忙请稍候再试',
  },
};


module.exports = config;
