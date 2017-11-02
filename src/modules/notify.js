const notifier = require('node-notifier');
const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const send = ({cfg, version, secrets, changelog}, message) => {
  return new Promise((resolve, reject) => {
    notifier.notify({
      title: 'My notification',
      message: 'Hello, there!'
    });
  });
};

const fail = ({cfg, version, secrets, changelog}, failMessage) => {
  if (cfg.has('notify')) {
    return send({cfg, version, secrets, changelog}, null);
  } else {
    return Promise.resolve();
  }
};

const success = ({cfg, version, secrets, changelog}) => {
  if (cfg.has('notify')) {
    //spinner.create(`kkk`);

    return send({cfg, version, secrets, changelog}, null);
  } else {
    return Promise.resolve();
  }
};

module.exports = {
  success,
  fail
};
