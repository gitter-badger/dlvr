var proxyquire = require('proxyquire');
const {configMock, gitMock, setStubGitLog, setStubGitStatus, setStubConfig} = require('./helper');

const config = proxyquire('../src/lib/config', configMock);
const git = proxyquire('../src/modules/git', gitMock);

process.env.DLVR_GITHUB='ma github token';

describe('#git checkRepo', function () {
  it('Should resolve', function (done) {
    config.boot().then((configs) => {
      git.checkRepo(configs).then((d) => {
        done();
      }).catch(e => console.log(e));
    });
  });

  it('Should reject because not on master branch', function (done) {
    setStubGitStatus({
      current: 'foo'
    }, true);

    config.boot().then((configs) => {
      git.checkRepo(configs).catch((err) => {
        expect(err.message).toBe('You are not on the master branch');
        done();
      });
    });
  });

  it('Should reject because there are changes in the repo', function (done) {
    setStubGitStatus({
      current: 'master',
      files: ['foo.js']
    }, true);

    config.boot().then((configs) => {
      git.checkRepo(configs).catch((err) => {
        expect(err.message).toBe('You have uncommitted changes - Please commit or stash them before release!');
        done();
      });
    });
  });
});

describe('#git tagExist', function () {
  it('Should resolve', function (done) {
    git.tagExist({version: '0.0.4'}).then((d) => {
      done();
    });
  });

  it('Should reject because Tag Exists', function (done) {
    setStubGitStatus({
      current: 'master',
      files: []
    }, true);

    git.tagExist({version: '0.0.2'}).catch((err) => {
      expect(err.message).toBe('Tag 0.0.2 already exists');
      done();
    });
  });
});


describe('#git determineVersion', function() {
    it('Should determine the correct version (patch)', function (done) {
    setStubConfig({
      logfilter: 'hadouken'
    }, true);

    setStubGitLog({
      all: [
        {message: 'some arbitary fix'},
        {message: 'make ci happy'},
        {message: 'linting sux'},
        ]
    });

    config.boot().then((configs) => {
      git.determineVersion(configs).then((data) => {
        expect(data).toEqual('patch');
        done();
      });
    });
  });

  it('Should determine the correct version (minor)', function (done) {
    setStubConfig({
      logfilter: 'hadouken'
    }, true);

    setStubGitLog({
      all: [
        {message: 'some arbitary fix'},
        {message: 'make ci happy'},
        {message: 'feature added'}
        ]
    });

    config.boot().then((configs) => {
      git.determineVersion(configs).then((data) => {
        expect(data).toEqual('minor');
        done();
      });
    });
  });

  it('Should determine the correct version (major)', function (done) {
    setStubConfig({
      logfilter: 'hadouken'
    }, true);

    setStubGitLog({
      all: [
        {message: 'some arbitary fix'},
        {message: 'make ci happy'},
        {message: 'feature added'},
        {message: 'some other fix'},
        {message: 'breaking change config'}
        ]
    });

    config.boot().then((configs) => {
      git.determineVersion(configs).then((data) => {
        expect(data).toEqual('major');
        done();
      });
    });
  });
});

describe('#git generateChangelog', function () {
  it('Should give back an array with filtered commit messages', function (done) {
    config.boot().then((configs) => {
      git.generateChangelog(configs).then((data) => {
        expect(data).toEqual(['- Test success #1  ', '- Test success #2  ']);
        done();
      });
    });
  });

  it('Should return an empty array', function (done) {
    setStubGitLog({
      all: [{message: 'yep - thats it'}]
    });

    config.boot().then((configs) => {
      git.generateChangelog(configs).then((data) => {
        expect(data).toEqual([]);
        done();
      });
    });
  });

  it('Should use the logfilter correctly', function (done) {
    setStubConfig({
      logfilter: 'hadouken'
    }, true);

    setStubGitLog({
      all: [{message: 'yep - thats it'}, {message: 'regex rox - hadouken triggers this!'}]
    });

    config.boot().then((configs) => {
      git.generateChangelog(configs).then((data) => {
        expect(data).toEqual( ['- regex rox - hadouken triggers this!  ' ]);
        done();
      });
    });
  });
});
