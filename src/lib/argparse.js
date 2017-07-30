var ArgumentParser = require('argparse').ArgumentParser;

const parsedArgs = () => {
  var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
  });

  const subparsers = parser.addSubparsers({
    title: 'subcommands',
    dest: 'subcmd'
  });

  const cmdMain = subparsers.addParser('release', {addHelp: true});

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
