const runner = require('./runner').runner;

const checkLogin = ({cfg}) => {
  if (cfg.has('npmpublish')) {
    return runner('npm who', 'Check NPM Login', 'No NPM Login');
  } else {
    return new Promise(resolve => resolve());
  }
};

const publish = ({cfg}) => {
  if (cfg.has('npmpublish')) {
    return runner(
      'npm publish',
      'Publishing on NPM',
      'Error while publishing on NPM'
    );
  } else {
    return new Promise(resolve => resolve());
  }
};

module.exports = {
  publish,
  checkLogin
};
