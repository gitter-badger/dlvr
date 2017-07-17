const prompt = require('prompt');
const git = require('./git');

const version = () => {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(['version'], (err, result) => {
      git.tagExist(result.version).then((tag) => {
        resolve(tag);
      }).catch((err) => {
        reject(err);
      });
    });
  });
};

module.exports = {
  version
};
