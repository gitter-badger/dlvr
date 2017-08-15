const fs = require('fs');
const validator = require('is-my-json-valid');
const {
  ENV_VAR_GITHUB,
  ENV_VAR_SNYK,
  FILE_TOKENS,
  FILE_CONFIG,
  FILE_PACKAGE
} = require('../constants');
const schemes = require('../schemes');
const utils = require('./utils');

const boot = () => {
  return new Promise((resolve, reject) => {
    loadPackage()
      .then(pkg => {
        loadConfig()
          .then(cfg => {
            loadTokens(cfg)
              .then(tokens => {
                return resolve({cfg, pkg, tokens});
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

const failMessage = function(err, prop) {
  var errStr = '';

  err.map(item => {
    var msg = `${item.field} in your config ${item.message} \n`.replace(
      'data.',
      `${prop}.`
    );
    errStr ? (errStr += msg) : (errStr = msg);
  });

  return errStr;
};

const checkIntegrity = function(cfg, prop) {
  if (prop === 'root' || (cfg.hasOwnProperty(prop) && cfg[prop] !== false)) {
    const validate = validator(schemes[prop]);
    const check = prop === 'root' ? cfg : cfg[prop];
    validate(check);

    if (validate.errors) {
      return failMessage(validate.errors, prop);
    }
  }
  return null;
};

const loadPackage = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE_PACKAGE, (err, result) => {
      utils.catchError(err, err, reject);
      resolve(JSON.parse(result));
    });
  });
};

// TODO: refactor this more generic
const loadTokens = cfg => {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE_TOKENS, (err, json) => {
      if (err && err.code === 'ENOENT') {
        json = {};
        if (process.env[ENV_VAR_GITHUB]) {
          json.github = process.env[ENV_VAR_GITHUB];
        }

        if (process.env[ENV_VAR_SNYK]) {
          json.snyk = process.env[ENV_VAR_SNYK];
        }

        json = JSON.stringify(json);
      } else {
        utils.catchError(err, err, reject);
      }

      var tokens = JSON.parse(json);

      if (cfg.has('gitlab') && !tokens.gitlab) {
        return reject(new Error('No gitlab token given'));
      }

      if (cfg.has('github') && !tokens.github) {
        return reject(new Error('No github token given'));
      }

      if (cfg.has('snyk') && !tokens.snyk) {
        return reject(new Error('No snyk token given'));
      }

      return resolve(tokens);
    });
  });
};

const loadConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE_CONFIG, (err, cfg) => {
      utils.catchError(err, err, reject);

      cfg = JSON.parse(cfg);

      cfg.has = function(prop) {
        return this.hasOwnProperty(prop) && this[prop] !== false;
      };

      cfg.getRemote = function() {
        return this.remote || 'origin';
      };

      cfg.hasRelease = function() {
        return (
          this.hasOwnProperty('github') &&
          this.github.hasOwnProperty('release') &&
          this.github.release !== false
        );
      };

      cfg.hasAssets = function() {
        return (
          this.hasRelease() &&
          this.github.release.hasOwnProperty('assets') &&
          this.github.release.assets !== false
        );
      };

      ['root', 'github', 'compress'].map(item => {
        var err = checkIntegrity(cfg, item);
        if (err) reject(new Error(err));
      });

      resolve(cfg);
    });
  });
};

module.exports = {
  boot,
  loadPackage,
  loadConfig,
  loadTokens
};
