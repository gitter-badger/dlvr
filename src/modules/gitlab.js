var FormData = require('form-data');
var fetch = require('node-fetch');
let fs = require('fs');
var request = require('request');

const uploadAssets = ({cfg, tokens}, projectId) => {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync('foo.txt');
    const fileSizeInBytes = stats.size;
    let readStream = fs.readFileSync('foo.txt');

    var opt = {
      url: `https://gitlab.com/api/v3/projects/${projectId}/uploads`,
      headers: {
        'PRIVATE-TOKEN': tokens.gitlab
      }
    };

    var req = request.post(opt, (err, resp, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });

    var form = req.form();
    form.append('file', readStream, {
      filename: 'foo.txt',
      contentType: 'text/plain'
    });
  });
};

const release = ({cfg, tokens}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('gitlab')) {
      var gitlab = require('gitlab')({
        url: 'https://gitlab.com',
        token: tokens.gitlab
      });

      gitlab.projects.all(projects => {
        var project = projects.filter(p => p.name === 'test-repo-gitlab')[0];
        fetch(
          `https://gitlab.com/api/v3/projects/${project.id}/repository/tags/0.0.2/release`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'PRIVATE-TOKEN': tokens.gitlab
            },
            body: JSON.stringify({
              tag_name: '0.0.2',
              description: 'version 2'
            })
          }
        )
          .then(response => response.json())
          .then(d => {
            console.log(d);
          })
          .catch(e => {
            console.log(e);
          });
      });
    } else {
      resolve();
    }
  });
};

const getProject = ({cfg, tokens}, userId) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('gitlab')) {
      fetch(`https://gitlab.com/api/v4/users/${userId}/projects`, {
        method: 'GET',
        headers: {
          'PRIVATE-TOKEN': tokens.gitlab
        }
      })
        .then(response => response.json())
        .then(data => {
          resolve(
            data.filter(project => project.name === cfg.gitlab.repo)[0].id
          );
        })
        .catch(e => {
          reject(new Error('Gitlab Token invalid'));
        });
    } else {
      resolve('skipped');
    }
  });
};
/*
Until gitlab lib is fixed i have to use this...
 */
const checkToken = ({cfg, tokens}) => {
  return new Promise((resolve, reject) => {
    if (cfg.has('gitlab')) {
      fetch('https://gitlab.com/api/v4/user', {
        method: 'GET',
        headers: {
          'PRIVATE-TOKEN': tokens.gitlab
        }
      })
        .then(response => response.json())
        .then(user => {
          if (user.message === '401 Unauthorized') {
            reject(new Error('Gitlab Token invalid'));
          } else {
            resolve(user.id);
          }
        })
        .catch(e => {
          reject(new Error('Gitlab Token invalid'));
        });
    } else {
      resolve('skipped');
    }
  });
};

module.exports = {
  checkToken,
  release,
  uploadAssets,
  getProject
};
