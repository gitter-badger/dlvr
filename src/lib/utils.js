const path = require('path');
const fs = require('fs');
const {red, blue, yellow, green} = require('chalk');

const PKG = require('../../package.json');
const spinner = require('./spinner');

const successMessage = (pkg, cfg, changelog) => {
  console.log('');
  console.log(`🎉  Successfully released ${yellow(pkg.name)} Version ${green(pkg.version)}`);
  console.log('');

  if (cfg.has('github')) {
    console.log(`Check your GitHub Release here: ${blue(`https://github.com/${cfg.github.repo}/releases`)}`);
  }

  if (cfg.has('npmpublish')) {
    console.log(`Check your NPM Release here: ${blue(`https://www.npmjs.com/package/${pkg.name}`)}`);
  }

  process.exit(0);
};

const intro = () => {
  console.log(blue(`=========================================`));
  console.log(yellow('________  .____ ____   ______________ '));
  console.log(yellow('\\______ \\ |    |\\   \\ /   /\\______   \\'));
  console.log(yellow(' |    |  \\|    | \\   Y   /  |       _/'));
  console.log(yellow(' |    `   \\    |__\\     /   |    |   \\'));
  console.log(yellow('/_______  /_______ \\___/    |____|_  /'));
  console.log(yellow('        \\/        \\/               \\/ '));
  console.log(blue(`v${PKG.version} ==================================`));
};

const info = (pkg, changelog) => {
  console.log(blue(`=========================================`));
  console.log(`Releasing ${yellow(pkg.name)}, current Version ${green(pkg.version)}`);

  if (changelog) {
    console.log(changelog);
  } else {
    console.log(`${red('No Changes found with the current logfilter')}`);
  }
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
      console.log(msg);
      process.exit(1);
    }
  }
};

module.exports = {
  intro,
  info,
  successMessage,
  catchError,
  saveVersion
};
