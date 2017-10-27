#! /usr/bin/env node

const utils = require('./lib/utils');
const spinner = require('./lib/spinner');

const git = require('./modules/git');
const zip = require('./modules/zip');
const npm = require('./modules/npm');
const snyk = require('./modules/snyk');
const runner = require('./modules/runner');
const github = require('./modules/github');
const gitlab = require('./modules/gitlab');
const slack = require('./modules/slack');
const output = require('./lib/output');

const run = async configs => {
  try {
    await git.checkRepo(configs);
    await git.tagExist(configs);
    await runner.preRun(configs);
    await runner.runTests(configs);
    await github.checkToken(configs);
    await slack.checkHook(configs);
    // NOTE: wrap them and return object ?
    const gitlabUser = await gitlab.getUser(configs);
    const gitlabProject = await gitlab.getProject(configs, gitlabUser);

    await npm.checkLogin(configs);
    await snyk.login(configs);

    await snyk.check(configs);
    await zip.compress(configs);
    await utils.saveVersion(configs);
    await utils.cleanup();
    await git.commitAndPush(configs);
    await git.tagAndPush(configs);
    await npm.publish(configs);

    const releaseId = await github.release(configs);

    // NOTE: maybe even wrap CVS Providers if possible ?
    await github.uploadAssets(configs, releaseId);
    const releaseMarkdown = await gitlab.uploadAssets(configs, gitlabProject);
    await gitlab.release(configs, gitlabProject, releaseMarkdown);

    await runner.postRun(configs);
    await slack.success(configs);

    spinner.success();
    output.successMessage(configs);
  } catch (err) {
    await slack.fail(configs, err.message);
    spinner.fail(err.message);
  }
};

module.exports = {
  run
};
