var Gitter = require('node-gitter');
const spinner = require('../lib/spinner');

const send = ({cfg, version, secrets, changelog}, message) => {
  return new Promise((resolve, reject) => {
    var gitter = new Gitter(secrets.get('gitter'));
    gitter.currentUser().then(function(user) {
      gitter.rooms.join(cfg.gitter.channel).then(function(room) {
        room.send(message).then(() => {
          resolve();
        });
      });
    });
  });
};

const fail = ({cfg, version, secrets, changelog}, failMessage) => {
  if (cfg.has('gitter') && cfg.gitter.reportfail) {
    const message = `:warning: Release **${version}** for [${cfg.githost
      .repo}](${cfg.releaseUrl()}) Failed with Message: \n ${failMessage}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

const success = ({cfg, version, secrets, changelog}) => {
  if (cfg.has('gitter')) {
    spinner.create(`Send Gitter message to ${cfg.gitter.channel}`);
    const message = `:tada: Just released [${cfg.githost
      .repo}](${cfg.releaseUrl()}) - Version **${version}** \n ${changelog}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

module.exports = {
  success,
  fail
};
