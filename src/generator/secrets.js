const prompt = require('prompt');

const overwrite = {
  name: 'overwrite',
  description: 'Do you really want to overwrite your secrets config ? y/n',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'n',
  required: true
};

const schema = [
  {
    name: 'DLVR_GITHUB',
    description: 'Your GitHub token (enter to skip)',
    type: 'string',
    hidden: true,
    replace: '*'
  },
  {
    name: 'DLVR_GITLAB',
    description: 'Your GitLab token (enter to skip)',
    type: 'string',
    hidden: true,
    replace: '*'
  },
  {
    name: 'DLVR_GITLAB-API',
    description: 'GitLab API Url ',
    type: 'string',
    default: 'https://gitlab.com/api/v3/',
    ask: function() {
      return prompt.history('gitlab');
    }
  },
  {
    name: 'DLVR_SNYK',
    description: 'Your SNYK token (enter to skip)',
    type: 'string',
    hidden: true,
    replace: '*'
  },
  {
    name: 'DLVR_SLACK-WEBHOOK',
    description: 'Your Slack Webhook Url (enter to skip)',
    type: 'string'
  }
];

module.exports = {
  overwrite,
  schema
};
