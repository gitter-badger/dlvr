const fs = require('fs');
const {red} = require('chalk');

const {FILE_PACKAGE} = require('../constants');
const spinner = require('./spinner');

const fatal = msg => {
  console.error(`😢  ${red(msg)} `);
  process.exit(1);
};

const quit = msg => {
  console.log(msg);
  process.exit(0);
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

const saveVersion = ({version, pkg}) => {
  spinner.create('Write new Version into package.json');
  return new Promise((resolve, reject) => {
    pkg.version = version;
    var content = JSON.stringify(pkg, null, 2);
    fs.writeFile(FILE_PACKAGE, content, err => {
      catchError(err, err, reject);
      resolve();
    });
  });
};

const composeChangelog = (changelog, releases = []) => {
  changelog =
    changelog.length > 0 ? `**Changelog**  \n${changelog.join('\n')}  \n` : '';
  releases =
    releases.length > 0 ? `**Releases**  \n${releases.join('\n')}  ` : '';

  return `${changelog}\n${releases}`;
};

module.exports = {
  catchError,
  quit,
  fatal,
  saveVersion,
  composeChangelog
};
