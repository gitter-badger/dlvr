const rewire = require('rewire');
const config = rewire('../src/lib/config');

// surpress spinner logs
config.__set__('spinner', {
  create: function () {
    return 1;
  }
});

const rootValidMinimal = {
  readFile: function (path, cb) {
    cb(null, `{
  "logfilter": ".*#"
}`);
  }
};

const rootValidFalsified = {
  readFile: function (path, cb) {
    cb(null, `{
  "logfilter": ".*#",
  "github": false,
  "npmpublish": false,
  "compress": false
}`);
  }
};

const rootValidTrue = {
  readFile: function (path, cb) {
    cb(null, `{
  "compress": [
    {"in": "./dist/test.txt", "out": "./dist/test.zip"},
    {"in": "./dist/test2.txt", "out": "./dist/test2.zip"}
  ],
  "logfilter": ".*#",
  "github": {
    "token": "token",
    "repo": "freakzero/test-repo",
    "release": {
      "draft":true,
      "assets": [{
        "file": "./dist/test.zip",
        "name": "test.zip"
      },{
        "file": "./dist/test2.zip",
        "name": "test2.zip"
      }]
    }
  }
}`);
  }
};

describe('#config methods', function () {
  it('Should have sugar methods', function (done) {
    config.__set__('fs', rootValidMinimal);
    config.loadConfig().then((cfg) => {
      expect(typeof cfg.has).toBe('function');
      expect(typeof cfg.getRemote).toBe('function');
      expect(typeof cfg.hasRelease).toBe('function');
      expect(typeof cfg.hasAssets).toBe('function');
      done();
    });
  });
});

describe('#config minimal config', function () {
  it('Optionals should return false', function (done) {
    config.__set__('fs', rootValidMinimal);
    config.loadConfig().then((cfg) => {
      expect(cfg.has('github')).toBe(false);
      expect(cfg.has('compress')).toBe(false);
      expect(cfg.hasAssets()).toBe(false);
      expect(cfg.hasRelease()).toBe(false);
      done();
    });
  });

  it('Optionals should return false when prop is false', function (done) {
    config.__set__('fs', rootValidFalsified);
    config.loadConfig().then((cfg) => {
      expect(cfg.has('github')).toBe(false);
      expect(cfg.has('compress')).toBe(false);
      expect(cfg.has('npmpublish')).toBe(false);
      expect(cfg.hasAssets()).toBe(false);
      expect(cfg.hasRelease()).toBe(false);
      done();
    });
  });

  it('Optionals should return true', function (done) {
    config.__set__('fs', rootValidTrue);
    config.loadConfig().then((cfg) => {
      expect(cfg.has('github')).toBe(true);
      expect(cfg.has('compress')).toBe(true);
      expect(cfg.hasAssets()).toBe(true);
      expect(cfg.hasRelease()).toBe(true);
      done();
    });
  });

});
