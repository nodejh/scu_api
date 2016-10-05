// 和爬取网站相关的配置，不需要修改
const config = {
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
  lib: {
    url: {
      // 图书馆登陆 URL
      login:
      'http://lib.scu.edu.cn/sculib/(S(d4i4vq45jonredvrh4dgieb2))/index.aspx',
    },
    request: {
      VIEWSTATE: '/wEPDwULLTEwODEwODkxMjAPZBYCAgEPZBYUAgMPDxYCHgRUZXh0ZWRkAoUBDzwrAA0BAA8WBB4LXyFEYXRhQm91bmRnHgtfIUl0ZW1Db3VudAIGZBYCZg9kFhBmDw8WAh4HVmlzaWJsZWhkZAIBD2QWAmYPZBYKAgMPDxYEHgtOYXZpZ2F0ZVVybAUdfi9uZXdzL25ld3NkZXRhaWwuYXNweD9pZD02ODUfAAUrMjAxNuW5tOeni+WGrOWto+WbvuS5pummhuS4k+mimOiusuW6p+WuieaOkmRkAgUPDxYEHwRlHwAFKzIwMTblubTnp4vlhqzlraPlm77kuabppobkuJPpopjorrLluqflronmjpJkZAIHDw8WAh8AZWRkAgkPDxYCHwAFEjIwMTYtOS0yOSAxNToxMTowMmRkAgsPDxYCHwAFATBkZAICD2QWAmYPZBYKAgMPDxYEHwQFHX4vbmV3cy9uZXdzZGV0YWlsLmFzcHg/aWQ9Njg0HwAFSOS4reWbveS5puazleWutuWNj+S8muS4u+W4reiLj+Wjq+a+jeWFiOeUn+S4uuWbm+W3neWkp+WtpuWbvuS5pummhumimOivjWRkAgUPDxYEHwRlHwAFSOS4reWbveS5puazleWutuWNj+S8muS4u+W4reiLj+Wjq+a+jeWFiOeUn+S4uuWbm+W3neWkp+WtpuWbvuS5pummhumimOivjWRkAgcPDxYCHwBlZGQCCQ8PFgIfAAURMjAxNi05LTI5IDg6NTE6NTBkZAILDw8WAh8ABQEwZGQCAw9kFgJmD2QWCgIDDw8WBB8EBR1+L25ld3MvbmV3c2RldGFpbC5hc3B4P2lkPTY4Mx8ABUBDTktJ5bel5YW35Lmm57G76LWE5rqQ5pyN5Yqh5L2T6aqM5pyI5pqo5bqU55So5qGI5L6L5b6B6ZuG5aSn6LWbZGQCBQ8PFgQfBGUfAAVAQ05LSeW3peWFt+S5puexu+i1hOa6kOacjeWKoeS9k+mqjOaciOaaqOW6lOeUqOahiOS+i+W+gembhuWkp+i1m2RkAgcPDxYCHwBlZGQCCQ8PFgIfAAUSMjAxNi05LTIxIDE1OjU3OjMwZGQCCw8PFgIfAAUBMGRkAgQPZBYCZg9kFgoCAw8PFgYfBAUdfi9uZXdzL25ld3NkZXRhaWwuYXNweD9pZD02NzIfAAVd5Zub5bed5aSn5a2m5Zu+5Lmm6aaG6ZuG5oiQ566h55CG57O757uf5ZKM5pWw5a2X6LWE5rqQ566h55CG57O757uf5bm05bqm57u05oqk5oub5qCH5YWs5ZGKLi4uHwNoZGQCBQ8PFgYfBAU6aHR0cDovLzIwMi4xMTUuNTQuMjIvc2N1bGliL25ld3MvYXR0YWNoL+WFrOWRijIwMTYwOTE5LnBkZh8ABV3lm5vlt53lpKflrablm77kuabppobpm4bmiJDnrqHnkIbns7vnu5/lkozmlbDlrZfotYTmupDnrqHnkIbns7vnu5/lubTluqbnu7TmiqTmi5vmoIflhazlkYouLi4fA2dkZAIHDw8WAh8ABQN1cmxkZAIJDw8WAh8ABRIyMDE2LTktMTkgMTc6NTI6MDZkZAILDw8WAh8ABQEwZGQCBQ9kFgJmD2QWCgIDDw8WBB8EBR1+L25ld3MvbmV3c2RldGFpbC5hc3B4P2lkPTY3MR8ABVblm5vlt53lpKflrabjgIrkuK3lm73osLHniZLlupNWMS4wIOS6jOmbhuOAi+WNleS4gOadpea6kOmHh+i0remhueebrui0ree9ruaLm+agh+WFrOWRimRkAgUPDxYEHwRlHwAFVuWbm+W3neWkp+WtpuOAiuS4reWbveiwseeJkuW6k1YxLjAg5LqM6ZuG44CL5Y2V5LiA5p2l5rqQ6YeH6LSt6aG555uu6LSt572u5oub5qCH5YWs5ZGKZGQCBw8PFgIfAGVkZAIJDw8WAh8ABREyMDE2LTktMTggODozOToyMGRkAgsPDxYCHwAFATBkZAIGD2QWAmYPZBYKAgMPDxYEHwQFHX4vbmV3cy9uZXdzZGV0YWlsLmFzcHg/aWQ9NjY3HwAFNzIwMTblubTkuK3np4voioLjgIHlm73luoboioLlm77kuabppoblvIDmlL7ml7bpl7TlronmjpJkZAIFDw8WBB8EZR8ABTcyMDE25bm05Lit56eL6IqC44CB5Zu95bqG6IqC5Zu+5Lmm6aaG5byA5pS+5pe26Ze05a6J5o6SZGQCBw8PFgIfAGVkZAIJDw8WAh8ABRIyMDE2LTktMTIgMTE6MjA6NDdkZAILDw8WAh8ABQEwZGQCBw8PFgIfA2hkZAKtAQ8PFgIeCEltYWdlVXJsBRR+L2ltYWdlcy9jb3VudC84LmdpZmRkAq8BDw8WAh8FBRR+L2ltYWdlcy9jb3VudC85LmdpZmRkArEBDw8WAh8FBRR+L2ltYWdlcy9jb3VudC8yLmdpZmRkArMBDw8WAh8FBRR+L2ltYWdlcy9jb3VudC85LmdpZmRkArUBDw8WAh8FBRR+L2ltYWdlcy9jb3VudC80LmdpZmRkArcBDw8WAh8FBRR+L2ltYWdlcy9jb3VudC8xLmdpZmRkArkBDw8WAh8FBRR+L2ltYWdlcy9jb3VudC8yLmdpZmRkArsBDw8WAh8FBRR+L2ltYWdlcy9jb3VudC81LmdpZmRkGAIFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYBBRtMb2dpblZpZXdfdXNlcjpyZWFkZXJfbG9naW4FCG5ld3NsaXN0DzwrAAoBCAIBZDkswh5cuztOo3TpfKauDj6y1UDh',
      VIEWSTATEGENERATOR: '5040C8DA',
      reader_login_x: 25,
      reader_login_y: 6,
    },
  },
};


module.exports = config;
