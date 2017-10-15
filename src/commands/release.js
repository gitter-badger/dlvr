const semver = require('semver');
const git = require('simple-git');
const prompt = require('prompt');
const perform = require('../perform');
const config = require('../lib/config');
const output = require('../lib/output');
const utils = require('../lib/utils');
const changelogHelper = require('../lib/changelog');

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
    let configs = await config.boot();
    const changelog = await changelogHelper.getLog(configs);
    const determinedVersion = await changelogHelper.determineVersion(changelog);
    const useVersion =
      args.VERSION === 'auto' ? determinedVersion : args.VERSION;

    // generate changelog here - or take it from file
    configs.changelog = changelog;
    configs.version = semver.inc(configs.pkg.version, useVersion);

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

const releaseCiCmd = async => {
  git(process.cwd()).status((err, data) => {
    if (err) utils.fatal(err.message);
    data.current === 'master' || process.env.TRAVIS_BRANCH === 'master'
      ? releaseCmd({VERSION: 'auto', force: true})
      : utils.quit('DLVR: Not on master - skipping release');
  });
};

module.exports = {
  releaseCmd,
  releaseCiCmd
};
