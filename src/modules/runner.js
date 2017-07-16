var spawn = require('child_process').spawn;
const spinner = require('../lib/spinner');

const runner = (cmd, msg, errorMsg) => {
  spinner.create(msg);
  return new Promise((resolve, reject) => {
    const r = spawn(cmd, { shell: true });
    r.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    r.on('close', (code) => {
      if (code > 0) {
        spinner.fail(errorMsg, errorMsg, reject);
      }
      resolve();
    });
  });
}

runTests = (command) => {
  return new Promise((resolve, reject) => {
    if (command) {
      runner(
        command,
       'Run Test suites',
       'Tests failed'
      ).then(() => {
        spinner.success();
        resolve();
      });
    } else {
      resolve();
    }
  });
}

const npmPublish = (bool) => {
  return new Promise((resolve, reject) => {
    if (bool) {
      runner('npm who',
        'Check NPM Login',
        'No NPM Login'
      ).then(() => {
        runner('npm publish',
          'Publishing on NPM',
          'Error while publishing on NPM'
        ).then(() => {
          resolve();
        });
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  runTests,
  npmPublish
}
