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
        output.info(configs);
      });
    })
    .catch(err => {
      utils.fatal(err.message);
    });
}

module.exports = {
  statusCmd
};
