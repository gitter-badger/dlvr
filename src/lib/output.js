const {bold, red, blue, yellow, green} = require('chalk'); // eslint-disable-line no-unused-vars
const utils = require('./utils');
const changelogHelper = require('./changelog');

// TODO: refactor console.log
const successMessage = ({pkg, cfg, changelog}) => {
  console.log('');
  console.log(
    `🎉  Just released ${yellow(pkg.name)} Version ${green(pkg.version)}`
  );
  console.log('');

  if (cfg.isProvider('github')) {
    console.log(`Check your GitHub Release here: ${blue(cfg.releaseUrl())}`);
  }
  if (cfg.isProvider('gitlab')) {
    console.log(`Check your GitLab Release here: ${blue(cfg.releaseUrl())}`);
  }
  if (cfg.has('npmpublish')) {
    console.log(
      `Check your NPM Release here: ${blue(
        `https://www.npmjs.com/package/${pkg.name}`
      )}`
    );
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
  console.log(blue(`=========================================`));
};

const info = ({cfg, pkg, changelog, version}) => {
  if (version) {
    console.log(`Releasing ${yellow.bold(pkg.name)}`);
    console.log(
      `current Version ${green.bold(
        pkg.version
      )}, you want to release Version ${red.bold(version)}`
    );

    if (cfg.has('githost')) {
      console.log(
        `On provider ${yellow.bold(
          cfg.githost.provider
        )} in repository ${yellow.bold(cfg.githost.repo)}`
      );
    }
  } else {
    console.log(
      `Project: ${yellow.bold(pkg.name)} Current Version: ${green.bold(
        pkg.version
      )}`
    );
  }
  if (changelog.length > 0) {
    console.log(changelogHelper.composeChangelog(changelog));
  } else {
    console.log(`${red('No Changelog found with the current logfilter')}`);
  }
};

module.exports = {
  intro,
  info,
  successMessage
};
