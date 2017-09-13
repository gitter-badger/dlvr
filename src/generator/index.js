const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

const opn = require('opn');
const prompt = require('prompt');
const utils = require('../lib/utils');
const {FILE_SECRETS, FILE_PACKAGE, FILE_CONFIG} = require('../constants');
let template = require('./template');

const common = require('./common');
const github = require('./github');
const secrets = require('./secrets');

function copyHook() {
  const srcHook = path.join(__dirname, '../', 'partials', 'post-merge');
  const destHook = path.join(process.cwd(), '.git', 'hooks', 'post-merge');

  fs.access(srcHook, err => {
    if (err) {
      utils.fatal(err.message);
    }

    fs.access(destHook, err => {
      if (!err) {
        utils.fatal('post-merge hook already exists');
      }

      fs.createReadStream(srcHook).pipe(fs.createWriteStream(destHook));

      fs.chmod(destHook, '0700', err => {
        if (err) {
          utils.fatal(err.message);
        }
      });
    });
  });
}

function parse(results) {
  function isNo(item) {
    return (
      (typeof item === 'string' && item.trim() === '') ||
      (typeof item === 'string' && item.toLowerCase() === 'n')
    );
  }

  for (let item in results) {
    if (isNo(results[item]) && item === 'assets') {
      delete template.githost.release['assets'];
    } else if (isNo(results[item]) && item === 'githubdraft') {
      template.githost.release.draft = false;
    } else if (item === 'githook') {
      if (!isNo(results[item])) {
        copyHook();
      }
      delete template[item];
    } else if (isNo(results[item])) {
      delete template[item];
    }
  }
  return JSON.stringify(template, null, 2);
}

function runSchema(schema, data) {
  prompt.start();
  prompt.get(schema, function(err, results) {
    if (err) {
      utils.fatal(err.message);
    }

    fs.access(FILE_PACKAGE, err => {
      if (err) {
        utils.fatal(err.message);
      }

      var fileContent = parse(results);

      fs.writeFile(FILE_CONFIG, fileContent, err => {
        if (err) {
          utils.fatal(err.message);
        }
        utils.openEditor(FILE_CONFIG);
      });
    });
  });
}

function runGitHub() {
  template.githost.provider = 'github';
  const schema = [
    common.dotenv,
    common.repo,
    common.prerun,
    common.postrun,
    common.remote,
    common.logfilter,
    common.test,
    common.snyk,
    common.npmpublish,
    github.draft,
    github.assets,
    common.compress,
    common.slack,
    common.githook
  ];
  runSchema(schema, template);
}

function runGitLab() {
  template.githost.provider = 'gitlab';
  const schema = [
    common.dotenv,
    common.repo,
    common.prerun,
    common.postrun,
    common.remote,
    common.logfilter,
    common.test,
    common.snyk,
    common.npmpublish,
    github.assets,
    common.compress,
    common.slack,
    common.githook
  ];
  runSchema(schema, template);
}

function dotEnv() {
  const obj2env = obj => {
    let content = '';
    for (let entry in obj) {
      if ({}.hasOwnProperty.call(obj, entry)) {
        content += obj[entry].trim() !== '' ? `${entry}=${obj[entry]}\n` : '';
      }
    }
    return content;
  };

  const run = () => {
    prompt.start();
    prompt.get(secrets.schema, (err, wat) => {
      if (err) {
        utils.fatal(err.message);
      }

      fs.writeFile(FILE_SECRETS, obj2env(wat), err => {
        if (err) {
          utils.fatal(err.message);
        }
        utils.quit(
          '.env file was written - please ensure that you .gitignore this file'
        );
      });
    });
  };

  fs.access(FILE_SECRETS, err => {
    if (!err) {
      prompt.start();
      prompt.get([secrets.overwrite], (err, results) => {
        if (err) {
          utils.fatal(err.message);
        }
        if (results.overwrite.toLowerCase() === 'y') {
          run();
        }
      });
    } else {
      run();
    }
  });
}

function dotDlvr(arg) {
  switch (arg) {
    case 'github':
      runGitHub();
      break;
    case 'gitlab':
      runGitLab();
      break;
  }
}

module.exports = {
  dotDlvr,
  dotEnv
};
