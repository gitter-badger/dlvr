const fs = require('fs');
const path = require('path');
const validator = require('is-my-json-valid');
const {yellow} = require('chalk');

const schemes = require('../schemes');

const spinner = require('./spinner');
const utils = require('./utils');

const failMessage = function (err, prop) {
  var errStr = '';

  err.map((item) => {
    var msg = `${item.field} in your config ${item.message} \n`.replace('data.', `${prop}.`);
    errStr ? errStr += msg : errStr = msg;
  });

  return errStr;
};

const checkIntegrity = function (cfg, prop) {
  if (prop === 'root' || (cfg.hasOwnProperty(prop) && cfg[prop] !== false)) {
    spinner.create(`Check config integrity of ${yellow(prop)}`);
    const validate = validator(schemes[prop]);
    const check = prop === 'root' ? cfg : cfg[prop];
    validate(check);

    if (validate.errors) {
      return failMessage(validate.errors, prop);
    }
  }
  return null;
};

const loadConfig = () => {
  spinner.create('Load Config');

  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), '.dlvr'), (err, cfg) => {
      utils.catchError(err, err, reject);

      cfg = JSON.parse(cfg);

      cfg.has = function (prop) {
        return this.hasOwnProperty(prop);
      };

      cfg.getRemote = function () {
        return this.remote || 'origin';
      };

      cfg.hasRelease = function () {
        return (this.hasOwnProperty('github') && this.github.hasOwnProperty('release')) && this.github.release !== false;
      };

      cfg.hasAssets = function () {
        return (this.hasRelease() && this.github.release.hasOwnProperty('assets')) && this.github.release.assets !== false
      };

      ['root', 'github', 'compress'].map((item) => {
        var err = checkIntegrity(cfg, item);
        if (err) reject(new Error(err));
      });

      resolve(cfg);
    });
  });
};

module.exports = {
  loadConfig
};
