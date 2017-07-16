var git = require('simple-git')(process.cwd());
var og = require('octonode');
const spinner = require('../lib/spinner');
const utils = require('../lib/utils');
var asyncLoop = require('node-async-loop');
var fs = require('fs');
var path = require('path');

const uploadAssets = (config, id) => {
  return new Promise((resolve, reject) => {
    if (id) {
      var client = og.client(config.github.token);
      var release = client.release(config.github.repo, id);

      asyncLoop(config.github.release.assets,(item, next) => {
        var asset = fs.readFileSync(path.join(process.cwd(), item.file));
        spinner.create(`Upload Asset ${item.name}`);

        release.uploadAssets(asset, {
          name: item.name
        },(err, data) => {
          utils.catchError(err, err, reject);
          next();
        })
      }, (err) => {
        utils.catchError(err, err, reject);
        resolve();
      });
    } else {
      resolve();
    }
  });

}

const gitHubRelease = (config, version) => {
  spinner.create('Publish Release on GitHub');
  var CHANGELOG = '**Changelog:** \n\n';
  return new Promise((resolve, reject) => {

    git.tags(function(err, tags) {
      TAGS = tags.all.reverse();
      git.log({from: TAGS[1], to: TAGS[0]},(err, data) => {
        data.all.filter((item) => {
          return item.message;
        }).map((item) => {
          CHANGELOG += `- ${item.message} \n`;
        });

      }).exec(() => {
        var client = og.client(config.github.token);
        var repo = client.repo(config.github.repo);

        repo.release({
          name: version,
          tag_name: version,
          body: CHANGELOG,
          draft: config.github.release.draft
        }, (err, data) => {
          utils.catchError(err, err, reject);
          if (config.github.release.assets.length > 0) {
            resolve(data.id);
          } else {
            resolve(false);
          }
        });
      });
    })
  });
}


const tagAndPush = (tag) => {
  spinner.create('Tag Release');
  return new Promise((resolve, reject) => {
    var REMOTE;
    git
    .listRemote(['--get-url'], function(err, data) {
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
}

const commitAndPush = (version) => {
  spinner.create('Commit and Push Release');
  return new Promise((resolve, reject) => {
    git.add('./*')
    .commit(`🎉 Release ${version}`)
    .push(['origin', 'master']);
    resolve();
  });
}

const tagExist = (tag) => {
  return new Promise((resolve, reject) => {
    git.tags((err, tags) => {
      utils.catchError(err, err, reject);

      if (tags.all.indexOf(tag) > -1)
        reject(`Tag ${tag} already exists`);

      resolve(tag);
    });
  });
}

const checkChanges = () => {
  spinner.create('Check git Repository');

  return new Promise((resolve, reject) => {
    git.diffSummary((err, data) => {
      utils.catchError(err, err);

      if (data.files.length > 0) {
        spinner.fail('You have uncommitted changes - Please commit them first!');
      }
      resolve();
    });
  });
}

module.exports = {
  uploadAssets,
  gitHubRelease,
  tagAndPush,
  commitAndPush,
  checkChanges,
  tagExist
}
