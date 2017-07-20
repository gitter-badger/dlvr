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
const github = require('./modules/github');

pack.read().then((pkg) => {
  utils.bootMessage(pkg);

  prompt.version(pkg).then((version) => {
    config.loadConfig().then((config) => {
      github.checkToken(config).then(() => {
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
                            git.generateChangelog(config, version).then((changelog) => {
                              github.release(config, version, changelog).then((releaseId) => {
                                github.uploadAssets(config, releaseId).then(() => {
                                  spinner.success();
                                  utils.successMessage(pkg, config, changelog);
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
}).catch((err) => {
  spinner.fail(err.message);
});
