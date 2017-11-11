const prompt = require('prompt');
const perform = require('../perform');
const config = require('../lib/config');
const output = require('../lib/output');
const utils = require('../lib/utils');
const changelogHelper = require('../lib/changelog');
const versionHelper = require('../lib/version');

const reallyScheme = {
  description: 'Do you really want to release ? y/n',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'n',
  required: true
};

const releaseCmd = async args => {
  try {
    let configs = await config.boot(args);
    const changelog = await changelogHelper.getLog(configs);
    const determinedVersion = await versionHelper.determineVersion(
      configs,
      changelog
    );
    configs.args = args;
    configs.changelog = changelog;
    configs.version = determinedVersion;

    output.intro();
    output.info(configs);

    if (args.force) {
      perform.run(configs);
    } else {
      prompt.start();
      prompt.get(reallyScheme, (err, result) => {
        utils.catchError(err);
        if (result.question.toLowerCase() === 'y') {
          perform.run(configs);
        }
      });
    }
  } catch (err) {
    utils.fatal(err.message);
  }
};
module.exports = releaseCmd;
