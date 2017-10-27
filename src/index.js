#! /usr/bin/env node

const {status, parsedArgs, releaseCmd} = require('./commands');
const generator = require('./generator');
const args = parsedArgs();

process.on('unhandledRejection', reason => {
  console.log('Unhandled Reject Reason: \n' + reason);
});

switch (args.subcmd) {
  case 'secrets':
    generator.dotEnv();
    break;

  case 'init':
    generator.dotDlvr(args.PROVIDER);
    break;

  case 'status':
    args.edit ? status.edit() : status.info();
    break;

  case 'release':
    releaseCmd(args);
    break;
}
