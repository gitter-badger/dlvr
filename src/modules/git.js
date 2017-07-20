const fs = require('fs');
const path = require('path');
const asyncLoop = require('node-async-loop');
const git = require('simple-git')(process.cwd());
const og = require('octonode');

const spinner = require('../lib/spinner');
const utils = require('../lib/utils');

const checkToken = (config) => {
  var client = og.client(config.github.token);

  return new Promise((resolve, reject) => {
    if (config.github) {
      spinner.create('Check GitHub Token');
      client.get('/user', {}, (err, status, body, headers) => {
        utils.catchError(err, err, reject);

        if (!body) {
          reject(new Error('Github Token invalid'));
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

const uploadAssets = (config, id) => {
  return new Promise((resolve, reject) => {
    if (config.github.release.assets.length > 0) {
      var client = og.client(config.github.token),
        release = client.release(config.github.repo, id);

      asyncLoop(config.github.release.assets, (item, next) => {
        var asset = fs.readFileSync(path.join(process.cwd(), item.file));
        spinner.create(`Upload asset ${item.name} to GitHub`);

        release.uploadAssets(asset, {
          name: item.name
        }, (err, data) => {
          utils.catchError(err, err, reject);
          next();
        });
      }, (err) => {
        utils.catchError(err, err, reject);
        resolve();
      });
    } else {
      resolve();
    }
  });
};

const generateChangelog = (config, version) => {
  spinner.create('Generating Changelog');
  var changelog = false;

  return new Promise((resolve, reject) => {
    git.tags((err, tags) => {
      utils.catchError(err, err, reject);
      const allTags = tags.all.reverse();
      const opt = allTags.length >= 2 ? {from: allTags[1], to: allTags[0]} : {};

      git.log(opt, (err, data) => {
        utils.catchError(err, err, reject);
        data.all.filter(
          (item) => config.github.release.logfilter ? new RegExp(config.github.release.logfilter).test(item.message) : true
        ).map((item) => {
          changelog === false ? changelog = `**Changelog:** \n\n - ${item.message} \n` : changelog += `- ${item.message} \n`;
        });
      }).exec(() => {
        resolve(changelog);
      });
    });
  });
};

const gitHubRelease = (config, version, changelog) => {
  spinner.create('Publish Release on GitHub');

  return new Promise((resolve, reject) => {
    var client = og.client(config.github.token),
      repo = client.repo(config.github.repo);

    repo.release({
      name: version,
      tag_name: version,
      body: changelog || '',
      draft: config.github.release.draft
    }, (err, data) => {
      utils.catchError(err, err, reject);
      resolve(data.id);
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
        reject(new Error('You have uncommitted changes - Please commit them first!'));
      }
      resolve();
    });
  });
};

module.exports = {
  generateChangelog,
  checkToken,
  uploadAssets,
  gitHubRelease,
  tagAndPush,
  commitAndPush,
  checkChanges,
  tagExist
};
