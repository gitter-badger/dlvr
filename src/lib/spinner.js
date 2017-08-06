const ora = require('ora');
const {red} = require('chalk');

const success = message => {
  global.spinner.succeed();
};

const create = message => {
  if (global.spinner) {
    global.spinner.succeed();
  }

  global.spinner = ora(message).start();
};

const fail = err => {
  if (global.spinner) {
    global.spinner.fail();
    console.log('');
  };
  console.error(`😢  ${red(err)} `);
  process.exit(1);
};

module.exports = {
  success,
  create,
  fail
};
