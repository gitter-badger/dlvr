const fs = require('fs');
const {red} = require('chalk');

const {FILE_PACKAGE} = require('../constants');
const spinner = require('./spinner');
const utils = require('./utils');

const {spawnSync} = require('child_process');
const opn = require('opn');

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

function openEditor(file) {
  const EDIT = process.env.EDITOR || process.env.VISUAL || false;
  if (EDIT) {
    spawnSync(EDIT, [file], {stdio: 'inherit'});
  } else {
    opn(file);
  }
}

module.exports = {
  catchError,
  quit,
  fatal,
  saveVersion,
  openEditor
};