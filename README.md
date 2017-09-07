# DLVR
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ec5758e41d734261ad66394abd7ecff3)](https://www.codacy.com/app/FreaKzero/dlvr?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=FreaKzero/dlvr&amp;utm_campaign=Badge_Grade)
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
Opens a Wizard which guides you through the release configuration `($PROJECT_ROOT/.dlvr)`, uses examplepaths for compress and release-assets.

### Get current Changelog
`dlvr status `
Checks your configuration integrity and tokens. Shows also the current filtered changelog.

### Release
`dlvr release (major|minor|patch|auto)`
- optional arguments:
  - `-f [--force] | Omit the "do you want to release" prompt`

Versions and Releases your Project based on your given configuration and release parameter.

If you use auto - SEMVER will be automatically determined by keywords "breaking" (x.0.0) and "feature" (0.x.0) in your commit messages.

## Config File
### .dlvr
**PATH**: `$PROJECT_DIR/.dlvr`
**Possible Configuration**
```
{
  "dotenv": ".env",
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
