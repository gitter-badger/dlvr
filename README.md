# DLVR
[![Known Vulnerabilities](https://snyk.io/test/github/freakzero/dlvr/badge.svg)](https://snyk.io/test/github/freakzero/dlvr)
[![npm version](https://badge.fury.io/js/dlvr.svg)](https://badge.fury.io/js/dlvr)
[![Build Status](https://travis-ci.org/FreaKzero/dlvr.svg?branch=master)](https://travis-ci.org/FreaKzero/dlvr)

[![asciicast](https://asciinema.org/a/wKDhgPsGbp51CuSsEMAnOZ7iV.png)](https://asciinema.org/a/wKDhgPsGbp51CuSsEMAnOZ7iV)

DeLiVeR - Command Line Tool to automate releasing processes on GitHub/GitLab/npm

## Install
`npm install -g dlvr`

## Commands

### Secrets Setup
`dlvr secrets`
Opens a wizard which guides you through the configuration of a dotenv file which contains your secrets (webhooks and tokens)

Or define this ENV vars globally
```
DLVR_GITHUB
DLVR_SNYK
DLVR_GITLAB
DLVR_GITLAB-API
DLVR_SLACK-WEBHOOK
```

### Write initial config
`dlvr init [github|gitlab]`
Opens a Wizard which guides you through the release configuration ($PROJECT_ROOT/.dlvr), uses examplepaths for compress and release-assets.

### Get current Changelog
`dlvr status `
Checks Tokens based on your current configuration and shows the Changelog for your current project progress.

### release
`dlvr release (major|minor|patch)`
- optional arguments:
  - `-f [--force] | Omit the "do you want to release" prompt`

Versions and Releases your Project based on your given configuration and release parameter.
## Config File
### .dlvr
**PATH**: `$PROJECT_DIR/.dlvr`
**Possible Configuration**
```
{
  "preRun": "npm run build",
  "postRun": "rm -rf ./dist",
  "snyk": true,
  "compress": [
    {
      "in": "./dist/myfile.bin",
      "out": "./dist/myfile.zip"
    }
  ],
  "logfilter": ".*#",
  "remote": "origin",
  "slack": {
    "channel": "#github",
    "icon_emoji": ":shipit:",
    "username": "dlvr.bot"
  },
  "githost": {
    "provider": "github",
    "repo": "username/repo",
    "release": {
      "draft": true,
      "assets": [
        {
          "file": "./dist/myfile.zip",
          "name": "myfile.zip"
        }
      ]
    }
  },
  "test": "npm run test",
  "npmpublish": false
}
```
