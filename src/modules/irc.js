const irc = require('irc');
const spinner = require('../lib/spinner');
const {IRC_RECONNECT} = require('../constants');

function send({cfg, version, secrets, changelog}) {
  return new Promise((resolve, reject) => {
    var client = new irc.Client(cfg.irc.server, cfg.irc.username, {
      autoConnect: false,
      channels: [cfg.irc.channel],
      userName: cfg.irc.username,
      realName: cfg.irc.username
    });

    client.connect(IRC_RECONNECT, function(serverReply) {
      client.addListener('error', function(message) {
        reject(message);
      });

      client.join(cfg.irc.channel, function(input) {
        client.say(cfg.irc.channel);
        client.disconnect();
      });
    });
  });
}

const fail = ({cfg, version, secrets, changelog}, failMessage) => {
  if (cfg.has('irc') && cfg.irc.reportfail) {
    const message = `Release *${version}* for *<${cfg.releaseUrl()}|${cfg
      .githost.repo}>* Failed with Message: ${failMessage}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

const success = ({cfg, version, secrets, changelog}) => {
  if (cfg.has('irc')) {
    spinner.create(`Send IRC message to ${cfg.irc.channel}`);
    const message = `Just released *<${cfg.releaseUrl()}|${cfg.githost
      .repo}>* Version *${version}* \n ${changelog}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

module.exports = {
  fail,
  success
};
