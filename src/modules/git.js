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

const tagAndPush = (tag, cfg) => {
  spinner.create('Tag Release');
  return new Promise((resolve, reject) => {
    git
      .addTag(tag, (err, res) => {
        utils.catchError(err, err, reject);
      })
      .pushTags(cfg.getRemote(), (err, res) => {
        utils.catchError(err, err, reject);
        resolve('Tag created and pushed');
      });
  });
};

const commitAndPush = (version, cfg) => {
  spinner.create('Commit and Push Release');
  return new Promise((resolve, reject) => {
    git.add('./*')
      .commit(`🎉 Release ${version}`)
      .push([cfg.getRemote(), 'master']);
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

const checkRepo = (cfg) => {
  return new Promise((resolve, reject) => {
    spinner.create('Check git Repository');
    git.status((err, status) => {
      utils.catchError(err, err, reject);
      if (status.files.length > 0) {
        reject(new Error('You have uncommitted changes - Please commit or stash them before release!'));
      }

      if (status.current !== 'master') {
        reject(new Error('You are not on the master branch'));
      }
    }).exec(() => {
      git.getRemotes(true, (err, data) => {
        utils.catchError(err, err, reject);

        if (data.length < 0) {
          reject(new Error(`No Remote found`));
        }

        var remoteExists = data.filter((item) => item.name === cfg.getRemote()).length > 0;

        if (!remoteExists) {
          reject(new Error(`Remote in config (${cfg.getRemote()}) is not available`));
        }

        resolve();
      });
    });
  });
};

module.exports = {
  generateChangelog,
  tagAndPush,
  commitAndPush,
  checkRepo,
  tagExist
};
