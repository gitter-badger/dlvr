var proxyquire = require('proxyquire');

let configStatus = `{
    "compress": [
      {"in": "./dist/test.txt", "out": "./dist/test.zip"},
      {"in": "./dist/test2.txt", "out": "./dist/test2.zip"}
    ],
    "logfilter": ".*#",
    "github": {
    "token": "token",
    "repo": "freakzero/test-repo",
    "release": {
      "draft":true
    }
  }
}`;

let configStatusNoCompress = `{
    "logfilter": ".*#",
    "github": {
    "token": "token",
    "repo": "freakzero/test-repo",
    "release": {
      "draft":true
    }
  }
}`;

let FILES = {
  in: [],
  out: []
};

let currentConfigStatus = configStatus;

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

let zipStub = {
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

  'zip-local': {
    zip: function (file, cb) {
      FILES.in.push(file);
      return cb(null, {
        compress: function () {
          return this;
        },
        save: function (file, cb) {
          FILES.out.push(file);
          cb(null);
        }
      });
    }
  }
};

describe('#zip compress', function () {
  const zip = proxyquire('../src/modules/zip', zipStub);

  beforeEach(function () {
    FILES = {
      in: [],
      out: []
    };
  });

  it('takes files and compresses them', function (done) {
    config.loadConfig().then((cfg) => {
      zip.compress(cfg).then((d) => {
        expect(FILES.in[0]).toContain('test.txt');
        expect(FILES.in[1]).toContain('test2.txt');
        expect(FILES.out[0]).toContain('test.zip');
        expect(FILES.out[1]).toContain('test2.zip');
        done();
      });
    });
  });

  it('skips compressing when config is not given', function (done) {
    currentConfigStatus = configStatusNoCompress;
    config.loadConfig().then((cfg) => {
      zip.compress(cfg).then((d) => {
        expect(FILES.in.length).toBe(0);
        expect(FILES.out.length).toBe(0);
        done();
      });
    });
  });
});
