// 和爬取网站相关的配置，不需要修改
const config = {
  // 教务系统相关配置
  zhjw: {
    url: {
      // 教务系统登陆 URL
      login: 'http://202.115.47.141/loginAction.do',
      // 课表页面
      curriculums: 'http://202.115.47.141/xkAction.do?actionType=6',
      // 本学期成绩。pageSize=100 参数主要是为了将所有成绩都显示在一页
      currentTerm: 'http://202.115.47.141/bxqcjcxAction.do?pageSize=100',
      // 所有及格成绩
      allPass: 'http://202.115.47.141/gradeLnAllAction.do?type=ln&oper=qbinfo',
      // 全部不及格成绩
      allFail: 'http://202.115.47.141/gradeLnAllAction.do?type=ln&oper=bjg',
    },
    errorText: {
      // 只要模拟登陆后返回的页面中有 ‘帐号’ 两个字，说明登陆失败
      account: '帐号',
      number: '你输入的证件号不存在，请您重新输入！',
      password: '您的密码不正确，请您重新输入！',
      database: '数据库忙请稍候再试',
    },
  },
  // 移动图书馆系统相关配置
  lib: {
    schoolid: 395,
    url: {
      // 图书馆手机首页
      home: 'http://m.5read.com/395',
      // 登陆 URL
      login: 'http://mc.m.5read.com/irdUser/login/opac/opacLogin.jspx',
      // 查看借阅列表菜单
      showScribleList: 'http://mc.m.5read.com/ird/scribe/showScribeList.jspx',
      // 借阅列表
      books: 'http://mc.m.5read.com/cmpt/opac/opacLink.jspx?stype=1',
    },
    errorText: {
      account: '用户名或密码错误',
      emptyPassword: '借阅证密码不能为空',
      emptyNumber: '借阅证号不能为空',
    },
  },
};


module.exports = config;
