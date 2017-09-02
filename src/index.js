#! /usr/bin/env node

const {
  configWizard,
  tokenWizard,
  statusCmd,
  parsedArgs,
  releaseCmd
} = require('./commands');
const generator = require('./generator');

const args = parsedArgs();

switch (args.subcmd) {
  case 'tokens':
    tokenWizard();
    break;

  case 'init':
    generator(args.PROVIDER);
    break;

  case 'status':
    statusCmd();
    break;

  case 'release':
    releaseCmd(args);
    break;
}
