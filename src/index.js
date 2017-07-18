#! /usr/bin/env node

const utils = require('./lib/utils');
const spinner = require('./lib/spinner');
const config = require('./lib/config');

const git = require('./modules/git');
const zip = require('./modules/zip');
const npm = require('./modules/npm');
const pack = require('./modules/pack');
const snyk = require('./modules/snyk');
const runner = require('./modules/runner');
const prompt = require('./modules/prompt');

pack.read().then((pkg) => {
  utils.bootMessage(pkg);

  prompt.version(pkg).then((version) => {
    config.loadConfig().then((config) => {
      git.checkToken(config).then(() => {
        npm.checkLogin(config).then(() => {
          snyk.login(config).then(() => {
            git.checkChanges().then(() => {
              snyk.check(config).then(() => {
                runner.runTests(config.test).then(() => {
                  zip.compress(config).then(() => {
                    utils.saveVersion(version, pkg).then(() => {
                      git.commitAndPush(version).then(() => {
                        git.tagAndPush(version).then(() => {
                          npm.publish(config).then(() => {
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
