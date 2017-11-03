const path = require('path');

const NOTIFICATION_TITLE = 'dlvr';
const FILE_SECRETS = path.join(process.cwd(), '.env');
const FILE_PACKAGE = path.join(process.cwd(), 'package.json');
const FILE_CONFIG = path.join(process.cwd(), '.dlvr');
const FILE_CHANGELOG = path.join(process.cwd(), '.changelog');

const AUTO_FILTER_MAJOR = '(breaking|deprecate)';
const AUTO_FILTER_MINOR = '(feature|plugin|module)';

const IRC_RECONNECT = 5;

module.exports = {
  FILE_SECRETS,
  FILE_PACKAGE,
  FILE_CONFIG,
  FILE_CHANGELOG,
  AUTO_FILTER_MAJOR,
  AUTO_FILTER_MINOR,
  IRC_RECONNECT,
  NOTIFICATION_TITLE
};
