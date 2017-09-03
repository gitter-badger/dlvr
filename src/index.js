#! /usr/bin/env node

const {statusCmd, parsedArgs, releaseCmd} = require('./commands');
const generator = require('./generator');
require('dotenv').config();
const args = parsedArgs();

switch (args.subcmd) {
  case 'secrets':
    generator.dotEnv();
    break;

  case 'init':
    generator.dotDlvr(args.PROVIDER);
    break;

  case 'status':
    statusCmd();
    break;

  case 'release':
    releaseCmd(args);
    break;
}
