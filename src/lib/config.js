const fs = require('fs');
const validator = require('is-my-json-valid');
const {FILE_SECRETS, FILE_CONFIG, FILE_PACKAGE} = require('../constants');
const schemes = require('../schemes');
const utils = require('./utils');

const loadPackage = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE_PACKAGE, (err, result) => {
      utils.catchError(err, err, reject);
      resolve(JSON.parse(result));
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

const loadSecrets = cfg => {
  return new Promise((resolve, reject) => {
    var secrets = {};
    ['github', 'gitlab', 'snyk'].map(item => {
      if (
        cfg.githost.provider === item &&
        !process.env[`DLVR_${item.replace('-', '_').toUpperCase()}`]
      ) {
        return reject(new Error(`No ${item} token given`));
      }
    });

    secrets.get = function(forService) {
      return (
        process.env[`DLVR_${forService.replace('-', '_').toUpperCase()}`] ||
        false
      );
    };

    return resolve(secrets);
  });
};

const loadConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE_CONFIG, (err, cfg) => {
      utils.catchError(err, err, reject);

      cfg = JSON.parse(cfg);

      cfg.releaseUrl = function() {
        switch (this.githost.provider) {
          case 'github':
            return `https://github.com/${this.githost.repo}/releases`;

          case 'gitlab':
            return `https://gitlab.com/${cfg.githost.repo}/tags`;
        }
      };

      cfg.has = function(prop) {
        return this.hasOwnProperty(prop) && this[prop] !== false;
      };

      cfg.isProvider = function(provider) {
        return this.githost.provider === provider;
      };

      cfg.getRemote = function() {
        return this.remote || 'origin';
      };

      cfg.getDotEnv = function() {
        return this.dotenv || FILE_SECRETS;
      };

      cfg.hasRelease = function() {
        return (
          this.hasOwnProperty('githost') &&
          this.githost.hasOwnProperty('release') &&
          this.githost.release !== false
        );
      };

      cfg.hasAssets = function() {
        return (
          this.hasRelease() &&
          this.githost.release.hasOwnProperty('assets') &&
          this.githost.release.assets !== false
        );
      };

      ['root', 'githost', 'compress', 'slack'].map(item => {
        var err = checkIntegrity(cfg, item);
        if (err) {
          reject(new Error(err));
        }
      });

      resolve(cfg);
    });
  });
};

const boot = () => {
  return new Promise((resolve, reject) => {
    loadPackage()
      .then(pkg => {
        loadConfig()
          .then(cfg => {
            require('dotenv').config({path: cfg.getDotEnv()});
            loadSecrets(cfg)
              .then(secrets => {
                return resolve({cfg, pkg, secrets});
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

module.exports = {
  boot,
  loadPackage,
  loadConfig,
  loadSecrets
};
