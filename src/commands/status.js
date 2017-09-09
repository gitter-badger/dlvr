const git = require('../modules/git');
const config = require('../lib/config');
const output = require('../lib/output');
const utils = require('../lib/utils');

function statusCmd() {
  // TODO: output that token config is ok
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
          .catch(e => {
            output.info(configs);
            utils.fatal(e.message);
          });
      });
    })
    .catch(err => {
      utils.fatal(err.message);
    });
}

module.exports = statusCmd;
