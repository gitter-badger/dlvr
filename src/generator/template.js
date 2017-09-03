let template = {
  preRun: 'npm run build',
  postRun: '',
  snyk: true,
  compress: [{in: './dist/myfile.bin', out: './dist/myfile.zip'}],
  logfilter: '.*#',
  remote: 'origin',
  slack: {
    channel: '#general',
    icon_emoji: ':shipit:',
    username: 'dlvr.bot'
  },
  githost: {
    provider: '',
    repo: 'username/repo',
    release: {
      draft: true,
      assets: [
        {
          file: './dist/myfile.zip',
          name: 'myfile.zip'
        }
      ]
    }
  },
  test: 'npm run test',
  npmpublish: false
};

module.exports = template;
