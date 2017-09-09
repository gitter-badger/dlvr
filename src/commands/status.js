const git = require('../modules/git');
const config = require('../lib/config');
const output = require('../lib/output');
const utils = require('../lib/utils');

function statusCmd() {
  config
    .boot()
    .then(configs => {
      git.generateChangelog(configs).then(changelog => {
        configs.changelog = changelog;
        git
          .checkRepo(configs, true)
          .then(() => {
            output.info(configs);
          })
          .catch(err => {
            output.info(configs);
            utils.fatal(err.message);
          });
      });
    })
    .catch(err => {
      utils.fatal(err.message);
    });
}

module.exports = statusCmd;
