const runner = require('./runner').runner;

const checkLogin = (config) => {
  return new Promise((resolve, reject) => {
    if (config.npmpublish) {
      runner('npm who',
        'Check NPM Login',
        'No NPM Login'
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

const publish = (config) => {
  return new Promise((resolve, reject) => {
    if (config.npmpublish) {
      runner('npm publish',
        'Publishing on NPM',
        'Error while publishing on NPM'
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
  publish,
  checkLogin
};
