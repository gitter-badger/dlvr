const {bold, red, blue, yellow, green} = require('chalk'); // eslint-disable-line no-unused-vars

const successMessage = ({pkg, cfg, changelog}) => {
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
  console.log(blue(`=========================================`));
};
const info = ({pkg, changelog, version}) => {
  if (version) {
    console.log(`Releasing ${yellow.bold(pkg.name)}`);
    console.log(`current Version ${green.bold(pkg.version)}, you want to release Version ${red.bold(version)}`);
  } else {
    console.log(`Project: ${yellow.bold(pkg.name)} Current Version: ${green.bold(pkg.version)}`);
  }

  if (changelog) {
    console.log(changelog);
  } else {
    console.log(`${red('No Changes found with the current logfilter')}`);
  }
};

module.exports = {
  intro,
  info,
  successMessage
};
