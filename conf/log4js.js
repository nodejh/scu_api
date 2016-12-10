const log4js = require('log4js');


log4js.configure({
  appenders: [{
    type: 'logLevelFilter',
    level: 'DEBUG',
    appender: {
      type: 'console',
    },
  }],
});

module.exports = log4js;
