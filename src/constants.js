const path = require('path');

const FILE_SECRETS = path.join(process.cwd(), '.env');
const FILE_PACKAGE = path.join(process.cwd(), 'package.json');
const FILE_CONFIG = path.join(process.cwd(), '.dlvr');

module.exports = {
  FILE_SECRETS,
  FILE_PACKAGE,
  FILE_CONFIG
};
