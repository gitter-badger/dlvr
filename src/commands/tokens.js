const fs = require('fs');
const prompt = require('prompt');
const utils = require('../lib/utils');
const {FILE_TOKENS} = require('../constants');

var HASTOKENS = true;

const tokenPromptSchema = [
  {
    name: 'overwrite',
    description: 'Do you really want to overwrite your Token config ? y/n',
    type: 'string',
    pattern: /^(y|n)$/i,
    message: 'Only Y/y (yes) or N/n (no) is allowed',
    default: 'n',
    required: true,
    ask: function() {
      try {
        fs.accessSync(FILE_TOKENS);
      } catch (e) {
        if (e.code === 'ENOENT') {
          HASTOKENS = false;
        } else {
          utils.fatal(e.message);
        }
      }
      return HASTOKENS;
    }
  },
  {
    name: 'github',
    description: 'Your GitHub token (enter to skip)',
    type: 'string',
    hidden: true,
    replace: '*',
    ask: function() {
      return (
        !HASTOKENS || prompt.history('overwrite').value.toLowerCase() === 'y'
      );
    }
  },
  {
    name: 'snyk',
    description: 'Your SNYK token (enter to skip)',
    type: 'string',
    hidden: true,
    replace: '*',
    ask: function() {
      return (
        !HASTOKENS || prompt.history('overwrite').value.toLowerCase() === 'y'
      );
    }
  }
];

function tokenWizard() {
  function getContent(content) {
    for (let prop in content) {
      if (new RegExp(/^(y|n)$/i).test(content[prop])) {
        delete content[prop];
      }
      if (content[prop] === '') {
        delete content[prop];
      }
    }

    if (Object.keys(content).length < 1) {
      return null;
    }
    return JSON.stringify(content, null, 2);
  }

  prompt.start();
  prompt.get(tokenPromptSchema, function(err, tokenContent) {
    if (err) utils.fatal(err.message);

    const content = getContent(tokenContent);
    if (content) {
      fs.writeFile(FILE_TOKENS, content, err => {
        if (err) utils.fatal(err.message);
        utils.quit('Tokenfile has been written');
      });
    } else {
      utils.fatal('No Tokens given');
    }
  });
}

module.exports = {
  tokenWizard
};
