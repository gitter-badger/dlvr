#! /usr/bin/env node

const {configWizard, tokenWizard, statusCmd, parsedArgs, releaseCmd} = require('./commands');
const args = parsedArgs();

switch (args.subcmd) {
  case 'tokens':
    tokenWizard();
    break;

  case 'init':
    configWizard();
    break;

  case 'status':
    statusCmd();
    break;

  case 'release':
    releaseCmd(args);
    break;
};
