const request = require('request');
const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const send = ({cfg, version, secrets, changelog}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('slack')) {
      spinner.create(`Send Slackmessage to ${cfg.slack.channel}`);
      let slackbody = cfg.slack;

      slackbody.text = `<!channel> \n Just released *<${cfg.releaseUrl()}|${cfg.githost.repo}>* Version *${version}* :tada: \n ${changelog}`; //eslint-disable-line
      var opt = {
        url: secrets.get('slack-webhook'),
        json: true,
        body: slackbody
      };

      delete slackbody.webhook;

      request.post(opt, (err, res, data) => {
        utils.catchError(err, err, reject);
        if (data === 'ok') {
          resolve();
        } else {
          reject(data);
        }
      });
    } else {
      resolve();
    }
  });
};
module.exports = {
  send
};
