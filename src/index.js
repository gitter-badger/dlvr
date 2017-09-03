#! /usr/bin/env node

const {tokenWizard, statusCmd, parsedArgs, releaseCmd} = require('./commands');
const generator = require('./generator');
require('dotenv').config();
const args = parsedArgs();

switch (args.subcmd) {
  case 'secrets':
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
