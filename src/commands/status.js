const git = require('../modules/git');
const config = require('../lib/config');
const output = require('../lib/output');

function statusCmd () {
  config.boot().then((configs) => {
    git.generateChangelog(configs).then((changelog) => {
      configs.changelog = changelog;
      output.info(configs);
    });
  });
}

module.exports = {
  statusCmd
};
