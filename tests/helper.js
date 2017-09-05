let gitLogStatusStub = {
  all: [
    {message: 'More tests (HEAD -> master, origin/master, origin/HEAD)'},
    {message: 'Test success #1'},
    {message: 'Test success #2'},
    {message: 'Shouldnt be filtered'},
  ],
  latest: {message: 'More tests (HEAD -> master, origin/master, origin/HEAD)'},
  total: 3 };

let gitStatusStub = {
  files: [],
  current: 'master'
};

let tokenStub = {
  github: 'ma github token',
  snyk: 'ma snyk token'
};

let packageStub = {
  version: '0.0.1'
};

let configStub = {
  dotenv: '.env',
  logfilter: '.*#',
  githost: {
    provider: "github",
    repo: 'freakzero/test-repo',
    release: {
      draft: true
    }
  }
};

function setStubGitLog (data) {
  gitLogStatusStub = data;
}

function setStubGitStatus (data, assign) {
  if (assign) {
    gitStatusStub = Object.assign({}, gitStatusStub, data);
  } else {
    gitStatusStub = data;
  }
}

function setStubToken (data) {
  tokenStub = data;
};

function setStubPackage (data) {
  packageStub = data;
};

function setStubConfig (data, assign) {
  if (assign) {
    configStub = Object.assign({}, configStub, data);
  } else {
    configStub = data;
  }
};

let gitMock = {
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
        cb(null, gitLogStatusStub);

        return this;
      },
      tags: function (cb) {
        cb(null, {latest: '0.0.3', all: ['0.0.2', '0.0.1']});

        return this;
      },
      status: function (cb) {
        cb(null, gitStatusStub);

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

let configMock = {
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
      if (path.indexOf('.dlvrtokens') > -1) {
        cb(null, JSON.stringify(tokenStub));
      } else if (path.indexOf('package.json') > -1) {
        cb(null, JSON.stringify(packageStub));
      } else {
        cb(null, JSON.stringify(configStub));
      }
    }
  }
};

function eachConfig () {
  tokenStub = {
    github: 'ma github token',
    snyk: 'ma snyk token'
  };

  packageStub = {
    version: '0.0.1'
  };

  configStub = {
    dotenv: '.env',
    logfilter: '.*#',
    githost: {
      provider: 'github',
      repo: 'freakzero/test-repo',
      release: {
        draft: true
      }
    }
  };
}

module.exports = {
  eachConfig,
  configMock,
  gitMock,
  setStubConfig,
  setStubPackage,
  setStubToken,
  setStubGitLog,
  setStubGitStatus
};
