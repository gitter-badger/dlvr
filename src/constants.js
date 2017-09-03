const path = require('path');

const getHome = () => {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

const FILE_SECRETS = path.join(getHome(), '.env');
const FILE_PACKAGE = path.join(process.cwd(), 'package.json');
const FILE_CONFIG = path.join(process.cwd(), '.dlvr');

module.exports = {
  FILE_SECRETS,
  FILE_PACKAGE,
  FILE_CONFIG
};
