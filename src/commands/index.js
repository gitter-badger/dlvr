//TODO: refactor the export of this commands to modules.exports = func

const {statusCmd} = require('./status');
const {parsedArgs} = require('./argparse');
const {releaseCmd} = require('./release');
const {copyHook} = require('./copyHook');

module.exports = {
  statusCmd,
  releaseCmd,
  parsedArgs,
  copyHook
};
