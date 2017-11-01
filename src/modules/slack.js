const request = require('request');
const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const send = ({cfg, version, secrets, changelog}, message) => {
  return new Promise((resolve, reject) => {
    let slackbody = cfg.slack;
    slackbody.text = message;

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
  });
};

const checkHook = ({cfg, version, secrets, changelog}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('slack')) {
      spinner.create(`Check Slack Webhook`);
      request.get(secrets.get('slack-webhook'), (err, res, data) => {
        utils.catchError(err, err, reject);
        if (res.body === 'invalid_payload') {
          resolve();
        } else {
          spinner.fail('Slack Webhook invalid');
        }
      });
    } else {
      return resolve();
    }
  });
};

const fail = ({cfg, version, secrets, changelog}, failMessage) => {
  if (cfg.has('slack') && cfg.slack.reportfail) {
    const message = `<!channel> \n :warning: Release *${version}* for *<${cfg.releaseUrl()}|${cfg
      .githost.repo}>* Failed with Message: \n ${failMessage}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

const success = ({cfg, version, secrets, changelog}) => {
  if (cfg.has('slack')) {
    spinner.create(`Send Slack message to ${cfg.slack.channel}`);
    const message = `<!channel> \n :tada: Just released *<${cfg.releaseUrl()}|${cfg
      .githost.repo}>* Version *${version}* \n ${changelog}`;
    return send({cfg, version, secrets, changelog}, message);
  } else {
    return Promise.resolve();
  }
};

module.exports = {
  success,
  fail,
  checkHook
};
