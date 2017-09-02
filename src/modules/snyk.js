const runner = require('./runner').runner;

const login = ({cfg, tokens}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('snyk')) {
      runner(
        `snyk auth ${tokens.get('snyk')}`,
        'Authenticate SNYK User',
        'SNYK Auth invalid'
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

const check = ({cfg}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('snyk')) {
      runner(
        'snyk test -q',
        'Checking SNYK for Vulnerabilities',
        'Vulnerabilities found'
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
  login,
  check
};
