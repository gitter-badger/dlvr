const path = require('path');
const zip = require('zip-local');
const asyncLoop = require('node-async-loop');

const utils = require('../lib/utils');
const spinner = require('../lib/spinner');

const compress = (config) => {
  return new Promise((resolve, reject) => {
    if (config.has('compress')) {
      asyncLoop(config.compress, (item, next) => {
        var fileIn = path.join(process.cwd(), item.in),
          fileOut = path.join(process.cwd(), item.out);

        spinner.create(`Compressing ${item.in}`);
        zip.zip(fileIn, (err, zipped) => {
          utils.catchError(err, err, reject);
          zipped.compress();

          zipped.save(fileOut, (err) => {
            utils.catchError(err, err, reject);
            next();
          });
        });
      }, (err) => {
        utils.catchError(err, err, reject);
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  compress
};
