const git = require('simple-git')(process.cwd());

const spinner = require('../lib/spinner');
const utils = require('../lib/utils');

const generateChangelog = (config) => {
  spinner.create('Generating Changelog');
  var changelog = false;

  return new Promise((resolve, reject) => {
    git.tags((err, tags) => {
      utils.catchError(err, err, reject);
      const allTags = tags.all.reverse();
      const opt = allTags.length >= 1 ? {from: allTags[0], to: 'HEAD'} : {};

      git.log(opt, (err, data) => {
        utils.catchError(err, err, reject);
        data.all.filter(
          (item) => config.has('logfilter') ? new RegExp(config.logfilter).test(item.message) : true
        ).map((item) => {
          changelog === false ? changelog = `**Changelog:**\n\n- ${item.message} \n` : changelog += `- ${item.message} \n`;
        });
      }).exec(() => {
        resolve(changelog);
      });
    });
  });
};

const tagAndPush = (tag) => {
  spinner.create('Tag Release');
  return new Promise((resolve, reject) => {
    var REMOTE;
    git
      .listRemote(['--get-url'], (err, data) => {
        utils.catchError(err, err, reject);
        REMOTE = data;
      })
      .addTag(tag, (err, res) => {
        utils.catchError(err, err, reject);
      })
      .pushTags(REMOTE, (err, res) => {
        utils.catchError(err, err, reject);
        resolve('Tag created and pushed');
      });
  });
};

const commitAndPush = (version) => {
  spinner.create('Commit and Push Release');
  return new Promise((resolve, reject) => {
    git.add('./*')
      .commit(`🎉 Release ${version}`)
      .push(['origin', 'master']);
    resolve();
  });
};

const tagExist = (tag) => {
  return new Promise((resolve, reject) => {
    git.tags((err, tags) => {
      utils.catchError(err, err, reject);

      if (tags.all.indexOf(tag) > -1) {
        reject(new Error(`Tag ${tag} already exists`));
      }

      resolve(tag);
    });
  });
};

const checkChanges = () => {
  spinner.create('Check git Repository');

  return new Promise((resolve, reject) => {
    git.diffSummary((err, data) => {
      utils.catchError(err, err);
      if (data.files.length > 0) {
        reject(new Error('You have uncommitted changes - Please commit or stash them before release!'));
      }
      resolve();
    });
  });
};

module.exports = {
  generateChangelog,
  tagAndPush,
  commitAndPush,
  checkChanges,
  tagExist
};
