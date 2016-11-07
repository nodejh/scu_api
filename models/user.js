const mongo = require('./../config/mongo');

const User = mongo.model('User', {
  number: { type: 'string' },  // 学号
  password: { type: 'string' },  // 教务系统密码
  password_lib: { type: 'string' },  // 图书馆密码
  token: { type: 'string' },  // token
  datetime: { type: 'number' },  // 注册时间
  updatetime: { type: 'number' },  // 最近登录时间（更新密码时间）
});


module.exports = {
  insert(user) {
    return User.insert(user).exec();
  },
  find(option) {
    return User.find(option).exec();
  },
  update(query, update, upsert, multi, writeConcern) {
    return User.update(query, update, upsert, multi, writeConcern).exec();
  },
};
