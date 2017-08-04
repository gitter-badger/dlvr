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

  const cmdMain = subparsers.addParser('release', {addHelp: true});

  subparsers.addParser('status', {addHelp: true});
  subparsers.addParser('init', {addHelp: true});
  subparsers.addParser('tokens', {addHelp: true});

  cmdMain.addArgument(['VERSION'], {
    action: 'store',
    help: '',
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
