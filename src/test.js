const irc = require('./modules/irc');
const config = require('./lib/config');

config.boot().then(configs => {
  irc.doEet(configs);
});
