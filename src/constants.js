const path = require('path');

const getHome = () => {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
};

const FILE_TOKENS = path.join(getHome(), '.dlvrtokens');
const FILE_PACKAGE = path.join(process.cwd(), 'package.json');
const FILE_CONFIG = path.join(process.cwd(), '.dlvr');

const GITHUB_API_URL = 'https://gitlab.com/api/v3';

module.exports = {
  FILE_TOKENS,
  FILE_PACKAGE,
  FILE_CONFIG,
  GITHUB_API_URL
};
