const mongo = require('./../config/mongo');

const User = mongo.model('User', {
  number: { type: 'string' },
  password: { type: 'string' },
  token: { type: 'string' },
  datetime: { type: 'number' },
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
