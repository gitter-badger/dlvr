const githook = {
  name: 'githook',
  description: 'Do you want to install a post-merge githook for master to release ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'y',
  required: true
};

const dotenv = {
  name: 'dotenv',
  description: 'Where is your .env file for this project ?',
  type: 'string',
  default: '.env',
  required: true
};

const repo = {
  name: 'repo',
  description: 'Whats your repo path ?',
  type: 'string',
  default: 'username/repository',
  required: true
};

const prerun = {
  name: 'preRun',
  description: 'Execute a command before releasing ? (empty to dismiss)',
  type: 'string'
};

const postrun = {
  name: 'postRun',
  description: 'Execute a command after releasing ? (empty to dismiss)',
  type: 'string'
};

const remote = {
  name: 'remote',
  description: 'Whats your default remote for releasing ?',
  type: 'string',
  default: 'origin'
};

const logfilter = {
  name: 'logfilter',
  description: 'Regex for Changelog filtering',
  type: 'string',
  default: '.*#'
};

const test = {
  name: 'test',
  description: 'Should dlvr run the tests before release ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'y',
  required: true
};

const slack = {
  name: 'slack',
  description: 'Do you want to use Slack notifier ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'y',
  required: true
};

const snyk = {
  name: 'snyk',
  description: 'Do you want to use Snyk.io ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'y',
  required: true
};

const npmpublish = {
  name: 'npmpublish',
  description: 'Do you want to publish on npm ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'y',
  required: true
};

const compress = {
  name: 'compress',
  description: 'Do you want to compress the assets before uplading ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'n',
  required: true
};

module.exports = {
  dotenv,
  slack,
  repo,
  prerun,
  postrun,
  remote,
  logfilter,
  test,
  snyk,
  npmpublish,
  compress,
  githook
};
