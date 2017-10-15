var ArgumentParser = require('argparse').ArgumentParser;
const pkg = require('../../package.json');

const parsedArgs = () => {
  var parser = new ArgumentParser({
    version: pkg.version,
    addHelp: true,
    description: 'dlvr'
  });

  const subparsers = parser.addSubparsers({
    title: 'subcommands',
    dest: 'subcmd'
  });

  subparsers.addParser('release-ci', {
    addHelp: true,
    help:
      'Auto releases without prompt or exits process gracefully if current branch is not master'
  });

  subparsers.addParser('secrets', {
    addHelp: true,
    help: 'Setup your secrets'
  });

  const cmdStatus = subparsers.addParser('status', {
    addHelp: true,
    help: 'Checks secrets and shows current changelog'
  });

  cmdStatus.addArgument(['-e', '--edit'], {
    action: 'storeTrue',
    help: 'Edit changelog',
    metavar: 'edit'
  });

  const cmdInit = subparsers.addParser('init', {
    addHelp: true,
    help: 'Initialize your Project [github|gitlab]'
  });

  cmdInit.addArgument(['PROVIDER'], {
    action: 'store',
    help: 'CVS (git) Provider',
    choices: ['github', 'gitlab']
  });

  const cmdMain = subparsers.addParser('release', {
    addHelp: true,
    help: 'Release your Project [major|minor|patch]'
  });

  cmdMain.addArgument(['VERSION'], {
    action: 'store',
    help: 'Release-version parameter',
    choices: ['major', 'minor', 'patch', 'auto']
  });

  cmdMain.addArgument(['-f', '--force'], {
    action: 'storeTrue',
    help: '',
    metavar: 'FORCE'
  });

  return parser.parseArgs();
};

module.exports = parsedArgs;
