let template = {
  dotenv: '.env',
  logfilter: '.*#',
  remote: 'origin',
  preRun: 'npm run build',
  postRun: '',
  test: 'npm run test',
  npmpublish: false,
  notify: true,
  compress: [
    {
      in: './dist/myfile.bin',
      out: './dist/myfile.zip'
    }
  ],
  gitter: {
    channel: 'username/repo',
    reportfail: true
  },
  irc: {
    channel: '#general',
    server: 'irc.myserver.com',
    username: 'dvlrbot',
    reportfail: true
  },
  slack: {
    channel: '#general',
    icon_emoji: ':shipit:',
    username: 'dlvr.bot',
    reportfail: true
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
