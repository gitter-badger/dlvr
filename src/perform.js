#! /usr/bin/env node

const utils = require('./lib/utils');
const spinner = require('./lib/spinner');

const git = require('./modules/git');
const zip = require('./modules/zip');
const npm = require('./modules/npm');
const snyk = require('./modules/snyk');
const runner = require('./modules/runner');
const github = require('./modules/github');
const output = require('./lib/output');

function run (configs) {
  git.checkRepo(configs).then(() => {
    github.checkToken(configs).then(() => {
      npm.checkLogin(configs).then(() => {
        snyk.login(configs).then(() => {
          snyk.check(configs).then(() => {
            runner.runTests(configs).then(() => {
              zip.compress(configs).then(() => {
                utils.saveVersion(configs).then(() => {
                  git.commitAndPush(configs).then(() => {
                    git.tagAndPush(configs).then(() => {
                      npm.publish(configs).then(() => {
                        github.release(configs).then((releaseId) => {
                          github.uploadAssets(configs, releaseId).then(() => {
                            spinner.success();
                            output.successMessage(configs);
                          }).catch((err) => {
                            spinner.fail(err.message);
                          });
                        }).catch((err) => {
                          spinner.fail(err.message);
                        });
                      }).catch((err) => {
                        spinner.fail(err.message);
                      });
                    }).catch((err) => {
                      spinner.fail(err.message);
                    });
                  }).catch((err) => {
                    spinner.fail(err.message);
                  });
                }).catch((err) => {
                  spinner.fail(err.message);
                });
              }).catch((err) => {
                spinner.fail(err.message);
              });
            }).catch((err) => {
              spinner.fail(err.message);
            });
          }).catch((err) => {
            spinner.fail(err.message);
          });
        }).catch((err) => {
          spinner.fail(err.message);
        });
      }).catch((err) => {
        spinner.fail(err.message);
      });
    }).catch((err) => {
      spinner.fail(err.message);
    });
  }).catch((err) => {
    spinner.fail(err.message);
  });
}

module.exports = {
  run
};
