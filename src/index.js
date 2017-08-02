#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const prompt = require('prompt');
const parsedArgs = require('./lib/argparse').parsedArgs;
const utils = require('./lib/utils');
const output = require('./lib/output');
const config = require('./lib/config');
const git = require('./modules/git');
const perform = require('./perform');
const {configWizard, tokenWizard} = require('./wizards');
const args = parsedArgs();

const promptSchema = {
  description: 'Do you really want to release ? y/n',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'n',
  required: true
};

switch (args.subcmd) {
  case 'tokens':
    tokenWizard();
    break;

  case 'init':
    fs.access(path.join(process.cwd(), 'package.json'), (err) => {
      if (err) utils.quit(err.message, 0);
      configWizard();
    });
    break;

  case 'status':
    config.boot().then((configs) => {
      git.generateChangelog(configs).then((changelog) => {
        configs.changelog = changelog;
        output.info(configs);
      });
    });
    break;
  case 'release':
    config.boot().then((configs) => {
      git.generateChangelog(configs).then((changelog) => {
        configs.changelog = changelog;
        configs.version = semver.inc(configs.pkg.version, args.VERSION);

        output.intro();
        output.info(configs);

        if (args.force) {
          perform.run(configs);
        } else {
          prompt.start();
          prompt.get(promptSchema, (err, result) => {
            utils.catchError(err);
            if (result.question.toLowerCase() === 'y') {
              perform.run(configs);
            }
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
    break;
};
