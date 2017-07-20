const ora = require('ora');
const {red} = require('chalk');

exports.success = message => {
  global.spinner.succeed();
};

exports.create = message => {
  if (global.spinner) {
    global.spinner.succeed();
  }

  global.spinner = ora(message).start();
};

exports.fail = err => {
  if (global.spinner) {
    global.spinner.fail();
    console.log('');
  };
  console.error(`😢  ${red(err)} `);
  process.exit(1);
};
