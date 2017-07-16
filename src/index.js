#! /usr/bin/env node

const utils = require('./lib/utils');
const spinner = require('./lib/spinner');
const config = require('./lib/config');

const git = require('./modules/git');
const runner = require('./modules/runner');
const prompt = require('./modules/prompt');

utils.bootMessage();

config.loadConfig().then((config) => {
  git.checkChanges().then(() => {
    runner.runTests(config.test).then(() => {
      prompt.version().then((version) => {
        utils.saveVersion(version).then(() => {
          git.commitAndPush(version).then(() => {
            git.tagAndPush(version).then(() => {
              runner.npmPublish(config.npmpublish).then(() => {
                git.gitHubRelease(config, version).then((id) => {
                  git.uploadAssets(config, id).then(() => {
                    spinner.success();
                    process.exit(0);
                  })
                });
              });
            });
          });
        }).catch((err) => {
          spinner.fail(err);
        })
      }).catch((err) => {
        spinner.fail(err)
      });
    });
  });
});
