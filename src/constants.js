const path = require('path');

const getHome = () => {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

const FILE_TOKENS = path.join(getHome(), '.dlvrtokens');
const FILE_PACKAGE = path.join(process.cwd(), 'package.json');
const FILE_CONFIG = path.join(process.cwd(), '.dlvr');

const ENV_VAR_GITHUB = 'DLVR_TOKEN_GITHUB';
const ENV_VAR_SNYK = 'DLVR_TOKEN_SNYK';

module.exports = {
  FILE_TOKENS,
  FILE_PACKAGE,
  FILE_CONFIG,
  ENV_VAR_GITHUB,
  ENV_VAR_SNYK
};
