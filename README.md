## SCU API

四川大学校园 API，具有登录四川大学教务系统、图书馆系统，获取个人课表、个人信息，获取个人成绩、计算绩点等功能。旨在方便开发者分析利用教务系统。


## Quick Start

```
$ git clone https://github.com/nodejh/scu_api
$ cd scu_api
$ npm install
$ npm start
```


## API 详细说明及使用方法

已实现 API：

+ 模拟登录
+ 获取课表
+ 成绩查询(含绩点计算)


TODO：

+ 考表查询
+ 借阅图书查询及图书续借
+ (一键评教)

API 主要分为两大类，模拟登录和信息抓取。

所有 API 路径都以 `${host}/api/v1` 开头。`v1` 表示版本号 Version 1。如模拟登录教务系统，则路径为 `${host}/api/v1/login/zhjw`。

+ 若在本地启动项目，则 `host` 为 `http://localhost:3000`
+ 若使用公开 API，则 `host` 为 `http://scuapi.nodejh.com`
+ 若是在自己的服务器上部署，则 `host` 为对应的 IP 或域名


#### 模拟登录


**模拟登录教务系统**


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


**模拟登录图书馆**

+ METHOD:  GET
+ URL:     /login/lib?number=[学号]&password=[密码]

将 `[学号]` 和 `[密码]` 替换为正确的学号密码（不包含`[` `]`）。

模拟登录成功后，返回的状态码 `code` 为 `0`，同时会返回密钥 `key` 和 `token`。之后每次向图书馆系统中的网页发起请求时，必须带上 `key` 和 `token` 参数。返回参数具体内容如下：

```
{
	"code": 0,
	"message": "登录图书馆系统成功",
	"key": "xxxxxxxxxxxx",
	"token": "11732eda29f44b90363d18d504dacd614bda49a6fbd7c47df82005360698153f6b295f76cc07ad8cd3656c8265907d270f7c0c7b74ebd04a73a7f0f7289d42de26836d8b40d0a99e38ede815e26b74a0176745d47c2bc75551ca962af2eff9543156bf9ef3f6ab02b958d571192051a7fa6eca07777dc6422b707e97e0495e56689ad31c5d1a4c36a46e6d364d099fda9884f29a5b5fad0daac10018a42f10dc7f5a4e1bbdaa4a1642ac78bdc5375a5634dd008e6dc244a6f7ee79698ba74effb861b4f7b3a9639ece859cbfc2fdff07c892ef450f204903a23ae2065780c5c10afcd8beb56d8b6ed422bc3bed327c898d9daee9db63b19b7a147822364af9e7729a4877ddaeaef87ca804d4be42ce81d3ce60cbaa0c2465efdaa0652849c407acebde9b483fa49038f5c8a117412b96b1af2c323286a2b07db32f8ce729d4149b8be6a23544e3b73acc1aa2f0c8a623e645ab17d10c46d364f4d0edbec3e11cbf65ae9b31a9efc12d9bb6a816871dc05ed9a22bdd7564fbc426f0a4f764464dee83601d1afd1f48bfc7fa8d4e38731c7e245f34ca405045ca5c0abec12c39abdbdcc9e3bb648f1b59c7c6a490c5a2a73db486fd2a2b6df1da455eb62532b8394229ee63a3f8885f6cc8caf5562ba57843c1ea2bb1e9948c0c8b75c79f5a996252aab30497e30d6b5ebaefb7e3942a7fd8549c159f788a456c3b40128619f1e258d1e487a8a88964300a96bdd36568239461e4ad6dedf71d23a1cea6ff48e55d2e5adbf2d55eea4aef92b9af36df048bc969b129a5086f729a42ed4b250fe706c3bdc6a59d0c4a6832ebb9ca4a65b2ea7c8d4829"
}
```


#### 抓取网页内容

在抓取需要登录后蔡恩感访问的页面之前，需要先登录以获取 `key` 和 `token`。

每次请求均需要带上 `key` 和 `token` 参数。

**获取图书借阅列表**

+ METHOD:  GET
+ URL:     /lib/books_lend?key=[key]&password=[token]

将 `[key]` 和 `[token]` 替换为模拟登录后返回的 `key` 和 `token`。不包含 `[` `]`。

```
{
	"code": 0,
	"data": {
		"books": {
			"booksNumber": 1,
			"books": [
				{
					"author": "李刚",
					"name": "疯狂Swift讲义",
					"expiredate": "20161010",
					"libraryBranch": "JZLKS",
					"number": "TP312SW/4072",
					"borId": "U13014748",
					"barCode": "90577318"
				}
			]
		}
	}
}
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

调用出错的 JSON 格式为：

```
{
  "code": 1001,    // 错误状态码
  "error': "",     // 错误信息
  "detail": "",    // 错误详情（可能没有）
}
```

调用正确的 JSON 格式为：

```
{
  "code": "0",   // 正确返回状态码固定为 0
  data: {}       // 返回的数据
}
```

错误码快速查询：

+ 1001 学号格式错误
+ 1002 密码格式错误
+ 1003 模拟登陆教务系统失败
+ 1004 教务系统返回学号错误
+ 1005 教务系统返回密码错误
+ 1006 教务系统学号或密码错误
+ 1007 获取课表传入cookie参数错误，可能是因为尚未登陆
+ 1008 抓取教务系统中的课表错误
+ 1009 教务系统数据库忙请稍候再试
+ 1010 尚未登录教务系统
+ 1011 获取课表时没有cookie信息，可能是因为尚未登陆
+ 1012 获取成绩传入cookie参数错误，可能是因为尚未登陆
+ 1013 获取当前学期成绩错误
+ 1014 获取所有及格成绩错误
+ 1015 获取所有不及格成绩错误
+ 1016 登录移动图书馆借阅证(学号)格式错误
+ 1017 登录移动图书馆系统密码格式错误
+ 1018 获取图书馆首页cookie失败
+ 1019 用户名或密码错误
+ 1020 借阅证密码不能为空
+ 1021 借阅证号不能为空
+ 1022 获取图书借阅列表URL传入key参数错误
+ 1023 获取图书借阅列表URL传入token参数错误
+ 1024 获取图书借阅列表传入参数错误
+ 1025 获取图书借阅列表失败
+ 1026 获取图书借阅列表失败，响应的状态码错误
+ 1027 移动图书馆系统cookie信息过期，请重新登录
+ 1028 续借图书URL传入key参数错误
+ 1029 续借图书传入token参数错误
+ 1030 续借图书URL传入barCode参数错误
+ 1031 续借图书URL传入borId参数错误
+ 1032 续借图书传入参数错误
+ 1033 续借图书传入key参数错误
+ 1034 续借图书传入token参数错误
+ 1035 续借图书传入图书参数错误
+ 1036 续借图书传入barCode参数错误
+ 1037 续借图书传入borId参数错误
+ 1038 续借图书失败
+ 1039 续借图书失败
+ 1040 续借操作不成功
