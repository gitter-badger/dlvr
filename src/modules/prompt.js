const prompt = require('prompt');
const semver = require('semver');
const utils = require('../lib/utils');
const git = require('./git');

const version = (pkg) => {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.get(['version'], (err, result) => {
      utils.catchError(err);

      git.tagExist(result.version).then((tag) => {
        if (!semver.valid(result.version)) {
          reject(new Error(`Release Version has to be in SEMVER format \n given: ${result.version}`));
        }

        if (!semver.gt(result.version, pkg.version)) {
          reject(new Error(`Release Version has to be higher \n current:${pkg.version} given:${result.version}`));
        }

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
