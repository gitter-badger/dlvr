const fs = require('fs');
const prompt = require('prompt');
const utils = require('../lib/utils');
const promptSchema = [
  {
    name: 'remote',
    description: 'Whats your default remote for releasing ?',
    type: 'string',
    default: 'origin'
  },
  {
    name: 'logfilter',
    description: 'Regex for Changelog filtering',
    type: 'string',
    default: '.*#'
  },
  {
    name: 'test',
    description: 'Should dlvr run the tests before release ?',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'y',
    required: true
  },
  {
    name: 'snyk',
    description: 'Do you want to use Snyk.io ?',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'y',
    required: true
  }, {
    name: 'npmpublish',
    description: 'Do you want to publish on npm ?',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'y',
    required: true
  }, {
    name: 'github',
    description: 'Do you want to release on github ?',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'y',
    required: true
  }, {
    name: 'repo',
    description: 'Whats your github repo ?',
    type: 'string',
    default: 'username/repo',
    required: true,
    ask: function () {
      return prompt.history('github').value.toLowerCase() === 'y';
    }
  }, {
    name: 'githubdraft',
    description: 'Should be your Github release a draft ?',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'y',
    required: true,
    ask: function () {
      return prompt.history('github').value.toLowerCase() === 'y';
    }
  }, {
    name: 'githubassets',
    description: 'Do you want to upload assets with your github release ?',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'n',
    required: true,
    ask: function () {
      return prompt.history('github').value.toLowerCase() === 'y';
    }
  }, {
    name: 'compress',
    description: 'Do you want to compress the assets before uplading ?',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'n',
    required: true,
    ask: function () {
      if (prompt.history('githubassets').value.toLowerCase() === 'n') { delete template.compress; }

      return prompt.history('githubassets').value.toLowerCase() === 'y';
    }
  }];

const template = {
  snyk: true,
  compress: [
    {in: './dist/myfile.bin', out: './dist/myfile.zip'}
  ],
  logfilter: '.*#',
  remote: 'origin',
  github: {
    repo: 'username/repo',
    release: {
      draft: true,
      assets: [{
        file: './dist/myfile.zip',
        name: 'myfile.zip'
      }]
    }
  },
  test: 'npm run test',
  npmpublish: false
};

function configWizard () {
  prompt.start();
  prompt.get(promptSchema, function (err, results) {
    if (err) utils.quit(err.message);

    for (var key in results) {
      if (results[key].toLowerCase() === 'n') {
        if (key === 'githubassets' && template.hasOwnProperty('github')) {
          delete template.github.release.assets;
        } else if (key === 'githubdraft' && template.hasOwnProperty('github')) {
          template.github.release.draft = results.githubdraft === 'y';
        } else {
          delete template[key];
        }
      }
    }

    template.remote = results.remote;
    template.logfilter = results.logfilter;

    if (template.github) {
      template.github.repo = results.repo;
    }

    const fileContent = JSON.stringify(template, null, 2);

    fs.writeFile('./.dlvr', fileContent, (err) => {
      if (err) utils.quit(err.message);

      console.log('');
      console.log(fileContent);
      console.log('\n Please edit your .dlvr file before releasing');
    });
  });
}

module.exports = {
  configWizard
};
