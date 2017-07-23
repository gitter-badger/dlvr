const fs = require('fs');
const path = require('path');
const validator = require('is-my-json-valid');
const {yellow} = require('chalk');

const schemes = require('../schemes');

const spinner = require('./spinner');
const utils = require('./utils');

const loadConfig = () => {
  spinner.create('Load Config');

  return new Promise((resolve, reject) => {
    fs.readFile(path.join(process.cwd(), '.dlvr'), (err, cfg) => {
      utils.catchError(err, err, reject);

      cfg = JSON.parse(cfg);

      cfg.has = function (prop) {
        return this.hasOwnProperty(prop);
      };

      cfg.hasRelease = function () {
        return (this.hasOwnProperty('github') && this.github.hasOwnProperty('release')) && this.github.release !== false;
      };

      cfg.hasAssets = function () {
        return this.hasOwnProperty('github') && this.github.hasOwnProperty('assets') && this.github.assets !== false;
      };

      // TODO: shouldnt be in cfg object
      cfg.failMessage = function (err, prop) {
        var errStr = '';

        err.map((item) => {
          var msg = `${item.field} in your config ${item.message} \n`.replace('data.', `${prop}.`);
          errStr ? errStr += msg : errStr = msg;
        });

        return errStr;
      };

      // TODO: shouldnt be in cfg object
      cfg.checkIntegrity = function (prop) {
        if (this.hasOwnProperty(prop) && this[prop] !== false) {
          const validate = validator(schemes[prop]);
          spinner.create(`Check config integrity of ${yellow(prop)}`);
          validate(this[prop]);
          if (validate.errors) {
            return this.failMessage(validate.errors, prop);
          }
        }
        return null;
      };

      ['github', 'compress'].map((item) => {
        var err = cfg.checkIntegrity(item);
        if (err) reject(new Error(err));
      });

      resolve(cfg);
    });
  });
};

module.exports = {
  loadConfig
};
