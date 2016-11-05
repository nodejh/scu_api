const config = require('./config');
const Mongolass = require('mongolass');


const mongolass = new Mongolass();
mongolass.connect(config.mongodb);


module.exports = mongolass;
