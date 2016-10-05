## SCU API

四川大学校园 API，具有登录四川大学教务系统、图书馆系统，获取个人课表、个人信息，获取个人成绩、计算绩点等功能。旨在方便开发者分析利用教务系统。


## Quick Start

```
$ git clone https://github.com/nodejh/scu_api
$ cd scu_api
$ npm install
$ npm start
```


## API

已实现 API：

+ 模拟登录
+ 获取课表
+ 成绩查询(含绩点计算)


TODO：

+ 考表查询
+ 借阅图书查询及图书续借
+ (一键评教)


#### 模拟登录

```
METHOD:  POST
API:     /api/login/zhjw

parameters:
{
  number: '000000000000',
  password: '000000',
}

return:
{
  "code":0,
  "msg":"登录成功"
}

TEST:
$ curl localhost:3000/api/login/zhjw -c ./cookie.txt -d 'number=00000000000000&password=000000'
```


#### 获取课表

```
METHOD:  GET
API:     /api/get_curriculums


return:
{
  "code": 0,
  "msg": "获取课表成功",
  "curriculums": [
    {
      "courseNumber":"304093030",    # 课程号
      "courseName":"海量数据处理与智能决策",    # 课程名
      "lessonNumber":"01",    # 课序号
      "credit":"3.0",    #  学分
      "courseProperty":"必修",    # 课程属性
      "examDate":"考试",    # 考试类型
      "teachers":"周颖杰",    # 教师
      "studyingWays":"正常",    #  修读方式
      "courseStatus":"置入",    #  选课状态
      "weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],    # 周次
      "week":"4",    # 星期
      "session":[5, 6, 7],    # 节次
      "campus":"江安",    # 校区
      "tachingBuilding":"一教D座",    # 教学楼	 
      "classroom":"D302"    # 教室
    },
    ...
  ]
}


TEST:
$ curl -b ./cookie.txt localhost:3000/api/get_curriculums
```

#### 成绩查询(含绩点计算)

```
METHOD:  GET
API:     /api/get_curriculums


return:
{
  "code": 0,
  "msg": "获取所有成绩并计算绩点",

  "grades": {
    "currentTerm": {    # 当前学期
      "gradeList":[    # 课程及分数详情
        {    
          "courseNumber": "000000000",   # 课程号
          "lessonNumber": "00",   # 课序号
          "courseName": "高级语言程序设计-Ⅱ",   # 课程名
          "courseEnglishName": "Programming Language-Ⅱ",   # 英文课程名
          "credit": "0",    # 学分
          "courseProperty": "必修",   # 课程属性
          "grade":"0"   # 成绩
        },
        ...
      ],
      "averageGpa": 0,   # 绩点
      "averageGrade": 0,    # 平均分数
      "averageGpaObligatory": 0,    # 必修绩点
      "averageGradeObligatory": 0,    # 必修分数
      "sumCredit":0,    # 总学分
      "sumCreditObligatory": 0   # 总绩点
    },

    "allPass": [    # 所有及格成绩，按学期排列
      {   
        "term": "2013-2014学年秋(两学期)",    # 学期名称
        "list": [    # 该学期的所有成绩列表
          {
            "courseNumber":"000000000",
            "lessonNumber": "00",
            "courseName": "大学英语（综合）-1",
            "courseEnglishName": "College English (Comprehensive)-1",
            "credit": "0",
            "courseProperty":"必修",
            "grade": "0"
          },
          ...
        ],
        "averageGpa": 0,
        "averageGrade": 0,
        "averageGpaObligatory": 0,
        "averageGradeObligatory": 0,
        "sumCredit": 0,
        "sumCreditObligatory": 0
      },
      ...
    ],

    allFail: {    # 所有不及格成绩
      current: [    # 当前不及格成绩
        {
          "courseNumber": "000000000",
          "lessonNumber": "00",
          "courseName": "",   
          "courseEnglishName": "Methods of Mathematical Physics",
          "credit": "0",
          "courseProperty": "",
          "grade": "",
          "examDate": "20150308",   # 考试时间
          "failReason": ""    # 不及格原因
        },
        ...
      ],
      before: [     # 曾不及格成绩
        {
          "courseNumber": "000000000",
          "lessonNumber": "00",
          "courseName": "",   
          "courseEnglishName": "Methods of Mathematical Physics",
          "credit": "0",
          "courseProperty": "",
          "grade": "",
          "examDate": "20150308",   # 考试时间
          "failReason": ""    # 不及格原因
        },
        ...
      ]
    }
  }
}


TEST:
$ curl -b ./cookie.txt localhost:3000/api/get_curriculums
```


## Code

返回的 `code` 为 `0` 表示登录成功，其余均登录失败。

错误码快速查询：

+ 1001 学号格式错误
+ 1002 密码格式错误
+ 1003 模拟登陆教务系统失败
+ 1004 教务系统返回学号错误
+ 1005 教务系统返回密码错误
+ 1006 学号或密码错误
+ 1007 获取课表传入cookie参数错误，可能是因为尚未登陆
+ 1008 抓取教务系统中的课表错误
+ 1009 教务系统数据库忙请稍候再试
+ 1010 尚未登录
+ 1011 获取课表时没有cookie信息，可能是因为尚未登陆
+ 1012 获取成绩传入cookie参数错误，可能是因为尚未登陆
+ 1013 获取当前学期成绩错误
+ 1014 获取所有及格成绩错误
+ 1015 获取所有不及格成绩错误
+ 1016 抓取图书馆首页失败
+ 1017 模拟登陆图书馆失败
+ 1018 模拟登陆图书馆失败，学号或密码错误
