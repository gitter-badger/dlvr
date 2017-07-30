const path = require('path');
const fs = require('fs');

const spinner = require('./spinner');

const saveVersion = ({version, pkg}) => {
  spinner.create('Write new Version into package.json');
  return new Promise((resolve, reject) => {
    // Version is validated by Prompt
    pkg.version = version;

    var file = path.join(process.cwd(), 'package.json'),
      content = JSON.stringify(pkg, null, 2);

    fs.writeFile(file, content, (err) => {
      catchError(err, err, reject);
      resolve();
    });
  });
};

const getHome = () => {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
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
  saveVersion,
  getHome
};
