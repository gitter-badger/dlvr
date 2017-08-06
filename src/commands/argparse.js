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

  const cmdMain = subparsers.addParser('release', {
    addHelp: true,
    help: 'Release your Project [major|minor|patch]'
  });

  subparsers.addParser('status', {
    addHelp: true,
    help: 'Checks tokens and shows current changelog'
  });

  subparsers.addParser('init', {
    addHelp: true,
    help: 'Initialize a dlvr release config'
  });

  subparsers.addParser('tokens', {
    addHelp: true,
    help: 'Setup your tokens'
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
