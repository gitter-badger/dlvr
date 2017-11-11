const git = require('../modules/git');
const config = require('../lib/config');
const output = require('../lib/output');
const utils = require('../lib/utils');
const changelogHelper = require('../lib/changelog');

function edit(args) {
  config.boot(args).then(configs => {
    changelogHelper.getLog(configs).then(changelog => {
      changelogHelper.writeAndOpen(changelog);
    });
  });
}

function info(args) {
  config
    .boot(args)
    .then(configs => {
      changelogHelper.getLog(configs).then(changelog => {
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

module.exports = {
  edit,
  info
};
