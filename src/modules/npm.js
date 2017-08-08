const runner = require('./runner').runner;

const checkLogin = ({cfg}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('npmpublish')) {
      runner('npm who', 'Check NPM Login', 'No NPM Login')
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

const publish = ({cfg}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('npmpublish')) {
      runner(
        'npm publish',
        'Publishing on NPM',
        'Error while publishing on NPM'
      )
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
  publish,
  checkLogin
};
