const path = require('path');
const fs = require('fs');
const {blue, yellow, green} = require('chalk');

const PKG = require('../../package.json');
const spinner = require('./spinner');

const bootMessage = (pkg) => {
  console.log(blue(`=========================================`));
  console.log(yellow('________  .____ ____   ______________ '));
  console.log(yellow('\\______ \\ |    |\\   \\ /   /\\______   \\'));
  console.log(yellow(' |    |  \\|    | \\   Y   /  |       _/'));
  console.log(yellow(' |    `   \\    |__\\     /   |    |   \\'));
  console.log(yellow('/_______  /_______ \\___/    |____|_  /'));
  console.log(yellow('        \\/        \\/               \\/ '));
  console.log(blue(`============================] DLVR v${PKG.version}`));
  console.log();
  console.log(`Releasing ${yellow(pkg.name)}, current Version ${green(pkg.version)}`);
};

const saveVersion = (version, pkg) => {
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

const catchError = (err, msg, reject) => {
  if (err) {
    spinner.fail(err);
    if (reject) {
      reject(new Error(err));
    } else {
      console.log(msg); // TODO: print stacktrace on DEV ?
      process.exit(1);
    }
  }
};

module.exports = {
  bootMessage,
  catchError,
  saveVersion
};
