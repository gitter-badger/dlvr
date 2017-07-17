const spawn = require('child_process').spawn;
const spinner = require('../lib/spinner');

const runner = (cmd, msg, errorMsg) => {
  spinner.create(msg);
  return new Promise((resolve, reject) => {
    const r = spawn(cmd, { shell: true });

    r.on('close', (code) => {
      if (code > 0) {
        reject(new Error(errorMsg));
      }
      resolve();
    });
  });
};

const runTests = (command) => {
  return new Promise((resolve, reject) => {
    if (command) {
      runner(
        command,
        'Run Test suites',
        'Tests failed'
      ).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  runTests,
  runner
};
