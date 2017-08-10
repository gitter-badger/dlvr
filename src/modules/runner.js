const spawn = require('child_process').spawn;
const spinner = require('../lib/spinner');

const runner = (cmd, msg, errorMsg) => {
  spinner.create(msg);
  return new Promise((resolve, reject) => {
    const r = spawn(cmd, {shell: true});

    r.on('close', code => {
      if (code > 0) {
        reject(new Error(errorMsg));
      }
      resolve();
    });
  });
};

const preRun = ({cfg}) => {
  return new Promise((resolve, reject) => {
    if (cfg.preRun) {
      runner(cfg.preRun, `Run ${cfg.preRun}`, 'Pre Run failed')
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    } else {
      resolve();
    }
  });
};

const postRun = ({cfg}) => {
  return new Promise((resolve, reject) => {
    if (cfg.postRun) {
      runner(cfg.postRun, `Run ${cfg.postRun}`, 'Post Run failed')
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    } else {
      resolve();
    }
  });
};

const runTests = ({cfg}) => {
  return new Promise((resolve, reject) => {
    if (cfg.test) {
      runner(cfg.test, 'Run Test suites', 'Tests failed')
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    } else {
      resolve();
    }
  });
};

module.exports = {
  runTests,
  runner,
  preRun,
  postRun
};
