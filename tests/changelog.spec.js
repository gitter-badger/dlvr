var proxyquire = require('proxyquire');
const {configMock, gitMock, setStubGitLog, setStubGitStatus, setStubConfig, changelogStub} = require('./helper');

const config = proxyquire('../src/lib/config', configMock);
const git = proxyquire('../src/modules/git', gitMock);

const changelogHelper = require('../src/lib/changelog');

process.env.DLVR_GITHUB='ma github token';

describe('#git determineVersion', function() {
  let changeLog = [];
  beforeEach(function() {

     setStubGitLog({
      all: [
        {message: 'some arbitary fix'},
        {message: 'make ci happy'},
        {message: 'linting sux'},
        ]
      });

      setStubConfig({
        logfilter: 'hadouken'
      }, true);
  });

    it('Should determine the correct version (patch)', function (done) {

    changelog = [
      'some stuff',
      'some other stuff',
      'fix bug',
      'change controller'
    ];
    config.boot().then((configs) => {
      changelogHelper.determineVersion(changelog).then((data) => {
        expect(data).toEqual('patch');
        done();
      });
    });
  });

  it('Should determine the correct version (minor|feature)', function (done) {

  changelog = [
    'some stuff',
    'feature X added',
    'some other stuff'
  ];
    config.boot().then((configs) => {
      changelogHelper.determineVersion(changelog).then((data) => {
        expect(data).toEqual('minor');
        done();
      });
    });
  });

  it('Should determine the correct version (minor|plugin)', function (done) {

  changelog = [
    'some stuff',
    'plugin X added',
    'some other stuff'
  ];
    config.boot().then((configs) => {
      changelogHelper.determineVersion(changelog).then((data) => {
        expect(data).toEqual('minor');
        done();
      });
    });
  });

  it('Should determine the correct version (minor|module)', function (done) {

  changelog = [
    'some stuff',
    'module X added',
    'some other stuff'
  ];
    config.boot().then((configs) => {
      changelogHelper.determineVersion(changelog).then((data) => {
        expect(data).toEqual('minor');
        done();
      });
    });
  });

  it('Should determine the correct version (major|breaking)', function (done) {
    changelog = [
      'some stuff',
      'breaking X added',
      'some other stuff'
    ];

    config.boot().then((configs) => {
      changelogHelper.determineVersion(changelog).then((data) => {
        expect(data).toEqual('major');
        done();
      });
    });
  });

  it('Should determine the correct version (major|deprecated)', function (done) {
    changelog = [
      'some stuff',
      'deprecated method X',
      'some other stuff'
    ];

    config.boot().then((configs) => {
      changelogHelper.determineVersion(changelog).then((data) => {
        expect(data).toEqual('major');
        done();
      });
    });
  });

});