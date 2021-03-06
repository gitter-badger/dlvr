#! /usr/bin/env node

const {status, parsedArgs, releaseCmd} = require('./commands');
const generator = require('./generator');
const args = parsedArgs();
const output = require('./lib/output');

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
    output.updateNotification();
    // TODO: refactor this - do that in a main status method
    args.edit ? status.edit(args) : status.info(args);
    break;

  case 'release':
    releaseCmd(args);
    break;
}
