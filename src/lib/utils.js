const path = require('path');
const fs = require('fs');
const {red, blue, yellow, green} = require('chalk');

const PKG = require('../../package.json');
const spinner = require('./spinner');

const successMessage = (pkg, cfg, changelog) => {
  console.log('');
  console.log(`🎉  Successfully released ${yellow(pkg.name)} Version ${green(pkg.version)}`);
  console.log('');

  // Use tag ? Use id ? no idea...
  if (cfg.github.token) { // TODO: check draft ... use id
    console.log(`Check your GitHub Release here: ${blue(`https://github.com/${cfg.github.repo}/releases`)}`);
  }

  if (cfg.npmpublish) {
    console.log(`Check your NPM Release here: ${blue(`https://www.npmjs.com/package/${pkg.name}`)}`);
  }

  if (changelog) {
    console.log(yellow('Released with following Changelog'));
    console.log(changelog);
  } else {
    console.log(`${yellow('No Changes found with the current logfilter:')} ${red(cfg.github.release.logfilter)}`);
  }

  process.exit(0);
};

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
  successMessage,
  catchError,
  saveVersion
};
