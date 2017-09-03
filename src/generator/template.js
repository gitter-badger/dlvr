let template = {
  dotenv: '.env',
  logfilter: '.*#',
  remote: 'origin',
  preRun: 'npm run build',
  postRun: '',
  test: 'npm run test',
  npmpublish: false,
  snyk: true,
  compress: [
    {
      in: './dist/myfile.bin',
      out: './dist/myfile.zip'
    }
  ],
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
  }
};

module.exports = template;
