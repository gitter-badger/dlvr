# DLVR (ALPHA)
[![Known Vulnerabilities](https://snyk.io/test/github/freakzero/dlvr/badge.svg)](https://snyk.io/test/github/freakzero/dlvr)
[![npm version](https://badge.fury.io/js/dlvr.svg)](https://badge.fury.io/js/dlvr)
[![Build Status](https://travis-ci.org/FreaKzero/dlvr.svg?branch=master)](https://travis-ci.org/FreaKzero/dlvr)

*(Until real release use at your own risk, fallback from failure is not yet implemented)*

[![asciicast](https://asciinema.org/a/GIUTBq8TJPuk8lDtWKPUY163T.png)](https://asciinema.org/a/GIUTBq8TJPuk8lDtWKPUY163T)

Command Line tool for easy automated Releasing. See the ASCII cast.

You will get the most out of this Tool when you want to release binaries done with NWJS, Electron or pkg.

## Install
`npm install -g dlvr`

## Commands

### Write initial config
`dlvr init `  
Opens a Wizard which guides you through the release configuration ($PROJECT_ROOT/.dlvr), uses examplepaths for compress and release-assets.

### Get current Changelog
`dlvr status `  
Checks Tokens based on your current configuration and shows the Changelog for your current project progress.

### Tokensetup
`dlvr tokens `  
Opens a wizard which guides you through the configuration of a tokenfile ($HOME/.dlvrtokens)

### release
`dlvr release (major|minor|patch)`  
- optional arguments:
  - `-f [--force] | Omit the "do you want to release" prompt`

Versions and Releases your Project based on your given configuration and release parameter.
## Config Files

### .dlvrtokens
**PATH**: `$HOME/.dlvrtokens`   
Its also possible to use the environment variables 
```
DLVR_TOKEN_GITHUB
DLVR_TOKEN_SNYK
```
to provide the Tokens  
**Possible Configuration**  
```
{
  "github": "YOUR GITHUB TOKEN",
  "snyk": "YOUR SNYK TOKEN"
}
```

### .dlvr
**PATH**: `$PROJECT_DIR/.dlvr`  
**Possible Configuration**  
```
{
  snyk: true,
  compress: [
    {in: './dist/myfile.bin', out: './dist/myfile.zip'}
  ],
  logfilter: '.*#',
  remote: 'origin',
  github: {
    repo: 'username/repo',
    release: {
      draft: true,
      assets: [{
        file: './dist/myfile.zip',
        name: 'myfile.zip'
      }]
    }
  },
  test: 'npm run test',
  npmpublish: false
}
```
