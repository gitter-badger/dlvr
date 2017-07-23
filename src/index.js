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
  config.loadConfig().then((cfg) => {
    git.generateChangelog(cfg).then((changelog) => {
      spinner.success();
      utils.bootMessage(pkg, changelog);

      prompt.version(pkg).then((version) => {
        github.checkToken(cfg).then(() => {
          npm.checkLogin(cfg).then(() => {
            snyk.login(cfg).then(() => {
              git.checkChanges().then(() => {
                snyk.check(cfg).then(() => {
                  runner.runTests(cfg.test).then(() => {
                    zip.compress(cfg).then(() => {
                      utils.saveVersion(version, pkg).then(() => {
                        git.commitAndPush(version).then(() => {
                          git.tagAndPush(version).then(() => {
                            npm.publish(cfg).then(() => {
                              github.release(cfg, version, changelog).then((releaseId) => {
                                github.uploadAssets(cfg, releaseId).then(() => {
                                  spinner.success();
                                  utils.successMessage(pkg, cfg, changelog);
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
