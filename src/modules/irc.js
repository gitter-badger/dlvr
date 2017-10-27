const irc = require('irc');
const spinner = require('../lib/spinner');

// TODO: support multiple channels
function send({cfg, version, secrets, changelog}) {
  return new Promise((resolve, reject) => {
    if (cfg.has('irc')) {
      var client = new irc.Client(cfg.irc.server, cfg.irc.username, {
        autoConnect: false,
        channels: [cfg.irc.channel],
        userName: cfg.irc.username,
        realName: cfg.irc.username
      });

      client.connect(5, function(serverReply) {
        console.log('connected to:', JSON.stringify(cfg.irc, null, 2));
        console.log(serverReply);

        client.addListener('error', function(message) {
          console.log('error: ', message);
        });

        client.join(cfg.irc.channel, function(input) {
          client.say(cfg.irc.channel);
          client.disconnect();
        });
      });
    }
  });
}

const fail = ({cfg, version, secrets, changelog}, failMessage) => {
  if (cfg.irc.reportfail) {
    const message = `Release *${version}* for *<${cfg.releaseUrl()}|${cfg
      .githost.repo}>* Failed with Message: ${failMessage}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

const success = ({cfg, version, secrets, changelog}) => {
  spinner.create(`Send IRC message to ${cfg.irc.channel}`);
  const message = `Just released *<${cfg.releaseUrl()}|${cfg.githost
    .repo}>* Version *${version}* \n ${changelog}`;
  return send({cfg, version, secrets, changelog}, message);
};

module.exports = {
  fail,
  success
};
