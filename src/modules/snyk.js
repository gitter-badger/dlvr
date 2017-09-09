const runner = require('./runner').runner;

const login = ({cfg, secrets}) => {
  if (cfg.has('snyk')) {
    return runner(
      `snyk auth ${secrets.get('snyk')}`,
      'Authenticate SNYK User',
      'SNYK Auth invalid'
    );
  } else {
    return new Promise(resolve => resolve());
  }
};

const check = ({cfg}) => {
  if (cfg.has('snyk')) {
    return runner(
      'snyk test -q',
      'Checking SNYK for Vulnerabilities',
      'Vulnerabilities found'
    );
  } else {
    return new Promise(resolve => resolve());
  }
};

module.exports = {
  login,
  check
};
