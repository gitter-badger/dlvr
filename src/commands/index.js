const {configWizard} = require('./config');
const {tokenWizard} = require('./tokens');
const {statusCmd} = require('./status');
const {parsedArgs} = require('./argparse');
const {releaseCmd} = require('./release');

module.exports = {
  configWizard,
  tokenWizard,
  statusCmd,
  releaseCmd,
  parsedArgs
};
