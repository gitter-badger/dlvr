const fs = require('fs');
const {FILE_PACKAGE} = require('../constants');
const spinner = require('./spinner');

const fatal = (msg, code) => {
  console.log(msg);
  process.exit(1);
};

const quit = (msg, code) => {
  console.log(msg);
  process.exit(0);
};

const saveVersion = ({version, pkg}) => {
  spinner.create('Write new Version into package.json');
  return new Promise((resolve, reject) => {
    pkg.version = version;
    var content = JSON.stringify(pkg, null, 2);
    fs.writeFile(FILE_PACKAGE, content, (err) => {
      catchError(err, err, reject);
      resolve();
    });
  });
};

const catchError = (err, msg, reject) => {
  if (err) {
    spinner.fail(err);
    if (reject) {
      reject(new Error(err));
    } else {
      console.log(msg);
      process.exit(1);
    }
  }
};

module.exports = {
  catchError,
  quit,
  fatal,
  saveVersion
};
