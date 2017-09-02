const fs = require('fs');
const {spawn} = require('child_process');
const prompt = require('prompt');
const utils = require('../lib/utils');
const {FILE_PACKAGE, FILE_CONFIG} = require('../constants');
let template = require('./template');
const common = require('./common');
const github = require('./github');

function runEditor() {
  const EDIT = process.env.EDITOR || process.env.VISUAL || false;
  if (EDIT) {
    const editorSpawn = spawn(EDIT, [FILE_CONFIG]);
    editorSpawn.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });

    editorSpawn.on('close', code => {
      console.log(`child process exited with code ${code}`);
    });
  } else {
    console.log('Check your configfile before releasing');
  }
}

function runSchema(schema, data) {
  prompt.start();
  prompt.get(schema, function(err, results) {
    if (err) utils.fatal(err.message);

    fs.access(FILE_PACKAGE, err => {
      if (err) utils.fatal(err.message, 0);

      var fileContent = parse(results);

      fs.writeFile(FILE_CONFIG, fileContent, err => {
        if (err) utils.fatal(err.message);
        runEditor();
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
    console.log(isNo(results[item]), item);
    if (isNo(results[item]) && item === 'assets') {
      delete template.githost.release['assets'];
    } else if (isNo(results[item]) && item === 'githubdraft') {
      template.githost.release.draft = false;
    } else if (isNo(results[item])) {
      delete template[item];
    }
  }
  return JSON.stringify(template, null, 2);
}

function runGitHub() {
  template.githost.provider = 'github';
  const schema = [
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
    common.compress
  ];
  runSchema(schema, template);
}

function runGitLab() {
  template.githost.provider = 'gitlab';
  const schema = [
    common.repo,
    common.prerun,
    common.postrun,
    common.remote,
    common.logfilter,
    common.test,
    common.snyk,
    common.npmpublish,
    github.assets,
    common.compress
  ];
  runSchema(schema, template);
}

function run(arg) {
  switch (arg) {
    case 'github':
      runGitHub();
      break;
    case 'gitlab':
      runGitLab();
      break;
  }
}

module.exports = run;
