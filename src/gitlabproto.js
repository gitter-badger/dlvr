#! /usr/bin/env node

const utils = require('./lib/utils');
const spinner = require('./lib/spinner');
const runner = require('./modules/runner');
const gitlab = require('./modules/gitlab');
const config = require('./lib/config');

function run(configs) {
  config
    .boot()
    .then(configs => {
      gitlab
        .checkToken(configs)
        .then(userId => {
          gitlab
            .getProject(configs, userId)
            .then(projectId => {
              gitlab
                .uploadAssets(configs, projectId)
                .then(d => {
                  console.log(d);
                })
                .catch(e => {
                  console.log(e);
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

run();
