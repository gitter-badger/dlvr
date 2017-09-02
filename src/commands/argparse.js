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

  subparsers.addParser('status', {
    addHelp: true,
    help: 'Checks tokens and shows current changelog'
  });

  subparsers.addParser('tokens', {
    addHelp: true,
    help: 'Setup your tokens'
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
    choices: ['major', 'minor', 'patch']
  });

  cmdMain.addArgument(['-f', '--force'], {
    action: 'storeTrue',
    help: '',
    metavar: 'FORCE'
  });

  return parser.parseArgs();
};

module.exports = {
  parsedArgs
};
