#! /usr/bin/env node

const utils = require('./lib/utils');
const spinner = require('./lib/spinner');
const config = require('./lib/config');

const git = require('./modules/git');
const zip = require('./modules/zip');
const runner = require('./modules/runner');
const prompt = require('./modules/prompt');

utils.bootMessage();

config.loadConfig().then((config) => {
  git.checkToken(config).then(() => {
    git.checkChanges().then(() => {
      runner.runTests(config.test).then(() => {
        zip.compress(config).then(() => {
          prompt.version().then((version) => {
            utils.saveVersion(version).then(() => {
              git.commitAndPush(version).then(() => {
                git.tagAndPush(version).then(() => {
                  runner.npmPublish(config.npmpublish).then(() => {
                    git.gitHubRelease(config, version).then((id) => {
                      git.uploadAssets(config, id).then(() => {
                        spinner.success('Successful Released');
                        process.exit(0);
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
    }).catch((err) => {
      spinner.fail(err.message);
    });
  }).catch((err) => {
    spinner.fail(err.message);
  });
}).catch((err) => {
  spinner.fail(err.message);
});
