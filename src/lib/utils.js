const fs = require('fs');
const {spawnSync} = require('child_process');
const {red} = require('chalk');
const opn = require('opn');

const {FILE_PACKAGE, FILE_CHANGELOG} = require('../constants');
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

function copyFile(src, dest, mod = '0700') {
  return new Promise((resolve, reject) => {
    let readStream = fs.createReadStream(src);

    readStream.once('error', err => {
      reject(err);
    });

    readStream.once('end', () => {
      fs.chmod(dest, mod, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
    readStream.pipe(fs.createWriteStream(dest));
  });
}
function openEditor(file) {
  const EDIT = process.env.EDITOR || process.env.VISUAL || false;
  if (EDIT) {
    spawnSync(EDIT, [file], {stdio: 'inherit'});
  } else {
    opn(file);
    process.exit(0);
  }
}
const cleanup = () => {
  spinner.create('Remove Changelog file');
  return new Promise((resolve, reject) => {
    fs.access(FILE_CHANGELOG, err => {
      if (!err) fs.unlinkSync(FILE_CHANGELOG);
      resolve();
    });
  });
};

module.exports = {
  copyFile,
  cleanup,
  catchError,
  quit,
  fatal,
  saveVersion,
  openEditor
};
