const path = require('path');

const getHome = () => {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

const FILE_TOKENS = path.join(getHome(), '.dlvrtokens');
const FILE_PACKAGE = path.join(process.cwd(), 'package.json');
const FILE_CONFIG = path.join(process.cwd(), '.dlvr');

module.exports = {
  FILE_TOKENS,
  FILE_PACKAGE,
  FILE_CONFIG
};
