const runner = require('./runner').runner;

const login = (config) => {
  return new Promise((resolve, reject) => {
    if (config.has('snyk')) {
      runner(`snyk auth ${config.snyk.token}`,
        'Authenticate SNYK User',
        'SNYK Auth invalid'
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

const check = (config) => {
  return new Promise((resolve, reject) => {
    if (config.has('snyk')) {
      runner('snyk test -q',
        'Checking SNYK for Vulnerabilities',
        'Vulnerabilities found'
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
  login,
  check
};
