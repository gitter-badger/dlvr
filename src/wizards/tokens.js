const path = require('path');
const fs = require('fs');
const prompt = require('prompt');
const utils = require('../lib/utils');

const tokenPromptSchema = [
  {
    name: 'github',
    description: 'Your GitHub token (enter to skip)',
    type: 'string'
  }, {
    name: 'snyk',
    description: 'Your SNYK token (enter to skip)',
    type: 'string'
  }
];

function tokenWizard () {
  prompt.start();
  prompt.get(tokenPromptSchema, function (err, tokenContent) {
    if (err) utils.quit(err.message);
    fs.writeFile(path.join(process.cwd(), 'package.json'), JSON.stringify(tokenContent, null, 2), (err) => {
      if (err) utils.quit(err.message);
      console.log('');
      console.log('\n Tokenfile has been written');
    });
  });
};

module.exports = {
  tokenWizard
};
