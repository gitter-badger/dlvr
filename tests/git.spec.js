var proxyquire = require('proxyquire');

let gitStatus = {
  files: [],
  current: 'master'
};

let configStatus = `{
    "logfilter": ".*#",
    "github": {
    "token": "token",
    "repo": "freakzero/test-repo",
    "release": {
      "draft":true
    }
  }
}`;

let configStatusHadouken = `{
    "logfilter": "hadouken",
    "github": {
    "token": "token",
    "repo": "freakzero/test-repo",
    "release": {
      "draft":true
    }
  }
}`;

let currentConfigStatus = configStatus;

let logStatus = {
  all: [
    {message: 'More tests (HEAD -> master, origin/master, origin/HEAD)'},
    {message: 'Test success #1'},
    {message: 'Test success #2'}
  ],
  latest: {message: 'More tests (HEAD -> master, origin/master, origin/HEAD)'},
  total: 3 };

let gitStub = {
  '../lib/spinner': {
    create: function () {
      return 1;
    },
    success: function () {
      return 1;
    },
    fail: function () {
      return 1;
    }
  },
  'simple-git': function () {
    return {
      exec: function (cb) {
        cb();
      },
      log: function (opt, cb) {
        cb(null, logStatus);

        return this;
      },
      tags: function (cb) {
        cb(null, {latest: '0.0.3', all: ['0.0.2', '0.0.1']});

        return this;
      },
      status: function (cb) {
        cb(null, gitStatus);

        return this;
      },
      getRemotes: function (bool, cb) {
        cb(null, [ { name: 'gitlab',
          refs:
     { fetch: 'https://gitlab.com/FreaKzero/dlvr.git',
       push: 'https://gitlab.com/FreaKzero/dlvr.git' } },
        { name: 'origin',
          refs:
     { fetch: 'git@github.com:FreaKzero/rlsr.git',
       push: 'git@github.com:FreaKzero/rlsr.git' } } ]);

        return this;
      }
    };
  }
};

const config = proxyquire('../src/lib/config', {
  './spinner': {
    create: function () {
      return 1;
    },
    success: function () {
      return 1;
    },
    fail: function () {
      return 1;
    }
  },
  fs: {
    readFile: function (path, cb) {
      cb(null, currentConfigStatus);
    }
  }
});

describe('#git checkRepo', function () {
  it('Should resolve', function (done) {
    const git = proxyquire('../src/modules/git', gitStub);
    config.loadConfig().then((cfg) => {
      git.checkRepo(cfg).then((d) => {
        done();
      });
    });
  });

  it('Should reject because not on master branch', function (done) {
    gitStatus.current = 'foo';
    const git = proxyquire('../src/modules/git', gitStub);
    config.loadConfig().then((cfg) => {
      git.checkRepo(cfg).catch((err) => {
        expect(err.message).toBe('You are not on the master branch');
        done();
      });
    });
  });

  it('Should reject because there are changes in the repo', function (done) {
    gitStatus = {
      current: 'master',
      files: ['foo.js']
    };

    const git = proxyquire('../src/modules/git', gitStub);
    config.loadConfig().then((cfg) => {
      git.checkRepo(cfg).catch((err) => {
        expect(err.message).toBe('You have uncommitted changes - Please commit or stash them before release!');
        done();
      });
    });
  });
});

describe('#git tagExist', function () {
  it('Should resolve', function (done) {
    gitStatus = {
      current: 'master',
      files: []
    };

    const git = proxyquire('../src/modules/git', gitStub);

    git.tagExist('0.0.4').then((d) => {
      done();
    });
  });

  it('Should reject because Tag Exists', function (done) {
    gitStatus = {
      current: 'master',
      files: []
    };

    const git = proxyquire('../src/modules/git', gitStub);

    git.tagExist('0.0.2').catch((err) => {
      expect(err.message).toBe('Tag 0.0.2 already exists');
      done();
    });
  });
});

describe('#git generateChangelog', function () {
  it('Should generate a right formatted changelog', function (done) {
    const git = proxyquire('../src/modules/git', gitStub);
    config.loadConfig().then((cfg) => {
      git.generateChangelog(cfg).then((data) => {
        expect(data).toBe('**Changelog:**\n\n- Test success #1 \n- Test success #2 \n');
        done();
      });
    });
  });

  it('Should return false when no changes can be found', function (done) {
    logStatus.all = [{message: 'yep - thats it'}];

    const git = proxyquire('../src/modules/git', gitStub);
    config.loadConfig().then((cfg) => {
      git.generateChangelog(cfg).then((data) => {
        expect(data).toBe(false);
        done();
      });
    });
  });

  it('Should use the logfilter correctly', function (done) {
    currentConfigStatus = configStatusHadouken;
    logStatus.all = [{message: 'yep - thats it'}, {message: 'regex rox - hadouken triggers this!'}];

    const git = proxyquire('../src/modules/git', gitStub);
    config.loadConfig().then((cfg) => {
      git.generateChangelog(cfg).then((data) => {
        expect(data).toBe('**Changelog:**\n\n- regex rox - hadouken triggers this! \n');
        done();
      });
    });
  });
});
