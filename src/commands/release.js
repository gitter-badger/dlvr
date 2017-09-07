const semver = require('semver');
const prompt = require('prompt');
const perform = require('../perform');
const git = require('../modules/git');
const config = require('../lib/config');
const output = require('../lib/output');
const utils = require('../lib/utils');

const promptSchema = {
  description: 'Do you really want to release ? y/n',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'n',
  required: true
};

function releaseCmd(args) {
  config
    .boot()
    .then(configs => {
      git
        .generateChangelog(configs)
        .then(changelog => {
          git
            .determineVersion(configs)
            .then(determinedVersion => {
              const useVersion =
                args.VERSION === 'auto' ? determinedVersion : args.VERSION;

              configs.changelog = changelog;
              configs.version = semver.inc(configs.pkg.version, useVersion);

              output.intro();
              output.info(configs);

              if (args.force) {
                perform.run(configs);
              } else {
                prompt.start();
                prompt.get(promptSchema, (err, result) => {
                  utils.catchError(err);
                  if (result.question.toLowerCase() === 'y') {
                    perform.run(configs);
                  }
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  releaseCmd
};
