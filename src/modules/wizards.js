const prompt = require('prompt');

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
    name: 'tests',
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
    default: 'y',
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
    default: 'y',
    required: true,
    ask: function () {
      if (prompt.history('githubassets').value.toLowerCase() === 'n') { delete template.compress; }

      return prompt.history('githubassets').value.toLowerCase() === 'y';
    }
  }];

const template = {
  snyk: true,
  compress: [
    {in: './dist/test.txt', out: './dist/test.zip'},
    {in: './dist/test2.txt', out: './dist/test2.zip'}
  ],
  logfilter: '.*#',
  remote: 'origin',
  github: {
    repo: 'username/repo',
    release: {
      draft: true,
      assets: [{
        file: './dist/test.zip',
        name: 'test.zip'
      }, {
        file: './dist/test2.zip',
        name: 'test2.zip'
      }]
    }
  },
  test: 'npm run test',
  npmpublish: false
};

function wizard () {
  prompt.get(promptSchema, function (err, results) {
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
    console.log(template);
  });
}

module.exports = {
  wizard
};
