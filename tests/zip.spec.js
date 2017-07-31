var proxyquire = require('proxyquire');
const {configMock, setStubConfig, eachConfig} = require('./helper');

const config = proxyquire('../src/lib/config', configMock);

let FILES = {
  in: [],
  out: []
};

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

  afterEach(function () {
    FILES = {
      in: [],
      out: []
    };
  });

  beforeEach(eachConfig);

  it('takes files and compresses them', function (done) {
    setStubConfig({
      compress: [
        {in: './dist/test.txt', out: './dist/test.zip'},
        {in: './dist/test2.txt', out: './dist/test2.zip'}
      ]
    }, true);
    config.boot().then((configs) => {
      zip.compress(configs).then((d) => {
        expect(FILES.in[0]).toContain('test.txt');
        expect(FILES.in[1]).toContain('test2.txt');
        expect(FILES.out[0]).toContain('test.zip');
        expect(FILES.out[1]).toContain('test2.zip');
        done();
      });
    });
  });

  it('skips compressing when config is not given', function (done) {
    config.boot().then((configs) => {
      zip.compress(configs).then((d) => {
        expect(FILES.in.length).toBe(0);
        expect(FILES.out.length).toBe(0);
        done();
      });
    });
  });
});
