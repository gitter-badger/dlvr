#! /usr/bin/env node

const utils = require('./lib/utils');
const spinner = require('./lib/spinner');

const git = require('./modules/git');
const zip = require('./modules/zip');
const npm = require('./modules/npm');
const snyk = require('./modules/snyk');
const runner = require('./modules/runner');
const github = require('./modules/github');
const gitlab = require('./modules/gitlab');
const output = require('./lib/output');

function run(configs) {
  runner
    .preRun(configs)
    .then(() => {
      git
        .checkRepo(configs)
        .then(() => {
          runner
            .runTests(configs)
            .then(() => {
              github
                .checkToken(configs)
                .then(() => {
                  gitlab
                    .getUser(configs)
                    .then(gitlabUser => {
                      gitlab
                        .getProject(configs, gitlabUser)
                        .then(gitlabProject => {
                          npm
                            .checkLogin(configs)
                            .then(() => {
                              snyk
                                .login(configs)
                                .then(() => {
                                  snyk
                                    .check(configs)
                                    .then(() => {
                                      zip
                                        .compress(configs)
                                        .then(() => {
                                          utils
                                            .saveVersion(configs)
                                            .then(() => {
                                              git
                                                .commitAndPush(configs)
                                                .then(() => {
                                                  git
                                                    .tagAndPush(configs)
                                                    .then(() => {
                                                      npm
                                                        .publish(configs)
                                                        .then(() => {
                                                          github
                                                            .release(configs)
                                                            .then(releaseId => {
                                                              github
                                                                .uploadAssets(
                                                                  configs,
                                                                  releaseId
                                                                )
                                                                .then(() => {
                                                                  gitlab
                                                                    .release(
                                                                      configs,
                                                                      gitlabProject
                                                                    )
                                                                    .then(
                                                                      () => {
                                                                        runner
                                                                          .postRun(
                                                                            configs
                                                                          )
                                                                          .then(
                                                                            () => {
                                                                              spinner.success();
                                                                              output.successMessage(
                                                                                configs
                                                                              );
                                                                            }
                                                                          );
                                                                      }
                                                                    )
                                                                    .catch(
                                                                      err => {
                                                                        spinner.fail(
                                                                          err.message
                                                                        );
                                                                      }
                                                                    );
                                                                })
                                                                .catch(err => {
                                                                  spinner.fail(
                                                                    err.message
                                                                  );
                                                                });
                                                            })
                                                            .catch(err => {
                                                              spinner.fail(
                                                                err.message
                                                              );
                                                            });
                                                        })
                                                        .catch(err => {
                                                          spinner.fail(
                                                            err.message
                                                          );
                                                        });
                                                    })
                                                    .catch(err => {
                                                      spinner.fail(err.message);
                                                    });
                                                })
                                                .catch(err => {
                                                  spinner.fail(err.message);
                                                });
                                            })
                                            .catch(err => {
                                              spinner.fail(err.message);
                                            });
                                        })
                                        .catch(err => {
                                          spinner.fail(err.message);
                                        });
                                    })
                                    .catch(err => {
                                      spinner.fail(err.message);
                                    });
                                })
                                .catch(err => {
                                  spinner.fail(err.message);
                                });
                            })
                            .catch(err => {
                              spinner.fail(err.message);
                            });
                        })
                        .catch(err => {
                          spinner.fail(err.message);
                        });
                    })
                    .catch(err => {
                      spinner.fail(err.message);
                    });
                })
                .catch(err => {
                  spinner.fail(err.message);
                });
            })
            .catch(err => {
              spinner.fail(err.message);
            });
        })
        .catch(err => {
          spinner.fail(err.message);
        });
    })
    .catch(err => {
      spinner.fail(err.message);
    });
}

module.exports = {
  run
};
