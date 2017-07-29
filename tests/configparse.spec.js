const rewire = require('rewire');
const config = rewire('../src/lib/config');

// surpress spinner logs
config.__set__('spinner', {
  create: function () {
    return 1;
  }
});

const rootValid = {
  readFile: function (path, cb) {
    cb(null, `{
  "logfilter": ".*#",
  "github": {
    "token": "<MAH TOKEN!>",
    "repo": "freakzero/dlvr",
    "release": {
      "draft": true
    }
  }
}`);
  }
};

const rootInvalid = {
  readFile: function (path, cb) {
    cb(null, `{
  "github": {
    "token": "<MAH TOKEN!>",
    "repo": "freakzero/dlvr",
    "release": {
      "draft": true
    }
  }
}`);
  }
};

const rootInvalidNested = {
  readFile: function (path, cb) {
    cb(null, `{
  "snyk": {},
  "logfilter": ".*#",
  "github": {
    "token": "<MAH TOKEN!>",
    "repo": "freakzero/dlvr",
    "release": {
      "draft": true
    }
  }
}`);
  }
};

describe('#config parse', function () {
  it('Should parse the valid config', function (done) {
    config.__set__('fs', rootValid);
    config.loadConfig().then((cfg) => {
      expect(typeof cfg.has).toBe('function');
      done();
    });
  });
});

const githubInvalidRelease = {
  readFile: function (path, cb) {
    cb(null, `{
  "logfilter": ".*#",
  "github": {
    "token": "<MAH TOKEN!>",
    "repo": "freakzero/dlvr",
    "release": {}
  }
}`);
  }
};

const githubInvalidAssets = {
  readFile: function (path, cb) {
    cb(null, `{
  "logfilter": ".*#",
  "github": {
    "token": "<MAH TOKEN!>",
    "repo": "freakzero/dlvr",
    "release": {
      "draft": true,
      "assets": [{"wat": "rly"}]
    }
  }
}`);
  }
};

describe('#config check integrity in root', function () {
  it('Should fail when root.logfilter is not given', function (done) {
    config.__set__('fs', rootInvalid);
    config.loadConfig().catch((err) => {
      expect(err.message).toBe('root.logfilter in your config is required \n');
      done();
    });
  });

  it('Should fail when snyk.token is not given', function (done) {
    config.__set__('fs', rootInvalidNested);
    config.loadConfig().catch((err) => {
      expect(err.message).toBe('root.snyk in your config is the wrong type \n');
      done();
    });
  });
});

describe('#config check integrity in github', function () {
  it('Should fail when release.draft is not given', function (done) {
    config.__set__('fs', githubInvalidRelease);
    config.loadConfig().catch((err) => {
      expect(err.message).toBe('github.release.draft in your config is required \n');
      done();
    });
  });

  it('Should fail when assets are wrong structured', function (done) {
    config.__set__('fs', githubInvalidAssets);
    config.loadConfig().catch((err) => {
      expect(err.message).toBe('github.release.assets.0.file in your config is required \ngithub.release.assets.0.name in your config is required \n');
      done();
    });
  });
});

const rootInvalidCompress = {
  readFile: function (path, cb) {
    cb(null, `{
  "compress": [{"wat": "rly"}],
  "logfilter": ".*#",
  "github": {
    "token": "<MAH TOKEN!>",
    "repo": "freakzero/dlvr",
    "release": {
      "draft": true
    }
  }
}`);
  }
};

describe('#config check integrity in compress', function () {
  it('Should fail when compress is wrong structured', function (done) {
    config.__set__('fs', rootInvalidCompress);
    config.loadConfig().catch((err) => {
      expect(err.message).toBe('compress.0.in in your config is required \ncompress.0.out in your config is required \n');
      done();
    });
  });
});

const tokenIntegrityInvalid = {
  readFile: function (path, cb) {
    if (path.indexOf('.dlvrtokens') > -1) {
      cb(null, `{}`);
    } else {
      cb(null, `{
        "logfilter": ".*#",
        "github": {
          "draft": "true",
          "repo": "freakzero/dlvr",
          "release": {
            "draft": true
          }
        }
      }`);
    }
  }
};

const tokenIntegrityValid = {
  readFile: function (path, cb) {
    if (path.indexOf('.dlvrtokens') > -1) {
      cb(null, `{"github" : "mah token"}`);
    } else {
      cb(null, `{
        "logfilter": ".*#",
        "github": {
          "draft": "true",
          "repo": "freakzero/dlvr",
          "release": {
            "draft": true
          }
        }
      }`);
    }
  }
};

const tokenIntegrityInvalidSnyk = {
  readFile: function (path, cb) {
    if (path.indexOf('.dlvrtokens') > -1) {
      cb(null, `{"github" : "mah token"}`);
    } else {
      cb(null, `{
        "snyk": true,
        "logfilter": ".*#",
        "github": {
          "draft": "true",
          "repo": "freakzero/dlvr",
          "release": {
            "draft": true
          }
        }
      }`);
    }
  }
};

describe('#config check token integrity', function () {
  it('Should fail because no github token given', function (done) {
    config.__set__('fs', tokenIntegrityInvalid);
    config.loadConfig().then((cfg) => {
      config.loadTokens(cfg).catch((err) => {
        expect(err.message).toBe('No github token given');
        done();
      });
    });
  });

  it('Should be successful with github tokenstring given', function (done) {
    config.__set__('fs', tokenIntegrityValid);
    config.loadConfig().then((cfg) => {
      config.loadTokens(cfg).then((tokens) => {
        expect(tokens.github).toBe('mah token');
        done();
      });
    });
  });

  it('Should fail because no snyk token given', function (done) {
    config.__set__('fs', tokenIntegrityInvalidSnyk);
    config.loadConfig().then((cfg) => {
      config.loadTokens(cfg).catch((err) => {
        expect(err.message).toBe('No snyk token given');
        done();
      });
    });
  });
});
