const path = require('path');

const NOTIFICATION_TITLE = 'dlvr';
const INTEGRITY_CHECK_SCHEMES = ['root', 'githost', 'compress', 'slack', 'irc'];

const FILE_SECRETS = path.join(process.cwd(), '.env');
const FILE_PACKAGE = path.join(process.cwd(), 'package.json');
const FILE_CONFIG = path.join(process.cwd(), '.dlvr');
const FILE_CHANGELOG = path.join(process.cwd(), '.changelog');

const FILTER_MAJOR_DEFAULT = ['breaking', 'deprecate'];
const FILTER_MINOR_DEFAULT = ['feature', 'plugin', 'module'];

const IRC_RECONNECT = 5;
const CHECK_UPDATE_URL = 'https://api.npms.io/v2/package/dlvr';

module.exports = {
  FILE_SECRETS,
  FILE_PACKAGE,
  FILE_CONFIG,
  FILE_CHANGELOG,
  FILTER_MAJOR_DEFAULT,
  FILTER_MINOR_DEFAULT,
  IRC_RECONNECT,
  NOTIFICATION_TITLE,
  INTEGRITY_CHECK_SCHEMES,
  CHECK_UPDATE_URL
};
