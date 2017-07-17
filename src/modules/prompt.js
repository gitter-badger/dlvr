const prompt = require('prompt');
const git = require('./git');
const utils = require('../lib/utils');

const version = () => {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(['version'], (err, result) => {
      utils.catchError(err);

      git.tagExist(result.version).then((tag) => {
        resolve(tag);
      }).catch((err) => {
        reject(new Error(err));
      });
    });
  });
};

module.exports = {
  version
};
