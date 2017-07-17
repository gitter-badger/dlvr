var PKG = require('../../package.json');
const spinner = require('./spinner');
const path = require('path');
const fs = require('fs');
const semver = require('semver');

const bootMessage = () => {
  console.log(`==========================================`);
  console.log('________  .____ ____   ______________ ');
  console.log('\\______ \\ |    |\\   \\ /   /\\______   \\');
  console.log(' |    |  \\|    | \\   Y   /  |       _/');
  console.log(' |    `   \\    |__\\     /   |    |   \\');
  console.log('/_______  /_______ \\___/    |____|_  /');
  console.log('        \\/        \\/               \\/ ');
  console.log(`============================] DLVR v${PKG.version}`);
};

const readPackage = () => {
  var pack = path.join(process.cwd(), 'package.json');
  return new Promise((resolve, reject) => {
    fs.readFile(pack, (err, result) => {
      catchError(err, err, reject);
      resolve(JSON.parse(result));
    });
  });
};

const saveVersion = (version) => {
  spinner.create('Write new Version into package.json');
  return new Promise((resolve, reject) => {
    readPackage().then((pkg) => {
      if (semver.valid(version) && semver.gt(version, pkg.version)) {
        pkg.version = version;
        var file = path.join(process.cwd(), 'package.json');
        var content = JSON.stringify(pkg, null, 2);

        fs.writeFile(file, content, (err) => {
          catchError(err, err, reject);
          resolve();
        });
      } else {
        reject('Given Version is not in a valid SEMVER format');
      }
    });
  });
};

const catchError = (err, msg, reject) => {
  if (err) {
    spinner.fail(err);
    if (reject) {
      reject(err);
    } else {
      console.log(msg);
      process.exit(1);
    }
  }
};

module.exports = {
  bootMessage,
  catchError,
  saveVersion
};
