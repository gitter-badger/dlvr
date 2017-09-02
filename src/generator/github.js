const draft = {
  name: 'githubdraft',
  description: 'Should be your Github release a draft ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'y',
  required: true
};

const assets = {
  name: 'assets',
  description: 'Do you want to upload assets with your github release ?',
  type: 'string',
  pattern: /^(y|n)$/i,
  message: 'Only Y/y (yes) or N/n (no) is allowed',
  default: 'n',
  required: true
};

module.exports = {
  draft,
  assets
};
