const spawn = require('child_process').spawn;
const spinner = require('../lib/spinner');

const runner = (cmd, msg, errorMsg) => {
  return new Promise((resolve, reject) => {
    if (cmd) {
      spinner.create(msg);
      const r = spawn(cmd, {shell: true});

      r.on('close', code => {
        if (code > 0) {
          reject(new Error(errorMsg));
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

const preRun = ({cfg}) =>
  runner(cfg.preRun, `Run ${cfg.preRun}`, 'Pre Run failed');

const postRun = ({cfg}) =>
  runner(cfg.postRun, `Run ${cfg.postRun}`, 'Post Run failed');

const runTests = ({cfg}) => runner(cfg.test, 'Run Test suites', 'Tests failed');

module.exports = {
  runTests,
  runner,
  preRun,
  postRun
};
