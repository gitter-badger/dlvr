var irc = require('irc');

function doEet({cfg, version, secrets, changelog}) {
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
      client.say(cfg.irc.channel, 'Some shit got released');
      client.disconnect();
    });

  });
}

module.exports = {
  doEet
};