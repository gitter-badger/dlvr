#! /usr/bin/env node

const semver = require('semver');
const prompt = require('prompt');
const parsedArgs = require('./lib/argparse').parsedArgs;
const utils = require('./lib/utils');
const output = require('./lib/output');
const config = require('./lib/config');
const git = require('./modules/git');
const perform = require('./perform');

const args = parsedArgs();

const promptSchema = {
  description: 'Do you really want to release ? y/n',
  type: 'string',
  pattern: /^\w+$/,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'n',
  required: true
};

switch (args.subcmd) {
  case 'release':
    if (!args.force) {
      config.boot().then((configs) => {
        git.generateChangelog(configs).then((changelog) => {
          configs.changelog = changelog;
          configs.version = semver.inc(configs.pkg.version, args.VERSION);

          output.intro();
          output.info(configs);

          prompt.start();
          prompt.get(promptSchema, (err, result) => {
            utils.catchError(err);
            if (result.question.toLowerCase() === 'y') {
              perform.run(configs);
            }
          });
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('RELEASE!');
    }
    break;
};
