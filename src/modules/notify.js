const notify = require('node-notify');
const {NOTIFICATION_TITLE} = require('../constants');

const send = ({cfg, version, secrets, changelog}, message) => {
  return new Promise((resolve, reject) => {
    notify({
      title: NOTIFICATION_TITLE,
      open: cfg.releaseUrl(),
      message
    });
  });
};

const fail = ({cfg, version, secrets, changelog}, failMessage) => {
  if (cfg.has('notify')) {
    const message = `Release ${cfg.releaseUrl()} Failed with Message: ${failMessage}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

const success = ({cfg, version, secrets, changelog}) => {
  if (cfg.has('notify')) {
    const message = `Just released ${cfg.releaseUrl()} - Version ${version}`;
    console.log(cfg.releaseUrl());
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

module.exports = {
  success,
  fail
};
