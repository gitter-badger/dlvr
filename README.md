# DLVR (ALPHA)
[![Known Vulnerabilities](https://snyk.io/test/github/freakzero/dlvr/badge.svg)](https://snyk.io/test/github/freakzero/dlvr)
[![npm version](https://badge.fury.io/js/dlvr.svg)](https://badge.fury.io/js/dlvr)
[![Build Status](https://travis-ci.org/FreaKzero/dlvr.svg?branch=master)](https://travis-ci.org/FreaKzero/dlvr)

*(Until real release use at your own risk, fallback from failure is not yet implemented)*

[![asciicast](https://asciinema.org/a/1Adp9YmICV5ev5VrgNPJpdYsk.png)](https://asciinema.org/a/1Adp9YmICV5ev5VrgNPJpdYsk)

Command Line tool for easy automated Releasing. See the ASCII cast.

You will get the most out of this Tool when you want to release binaries done with NWJS, Electron or pkg.

## Install
`npm install -g dlvr`


## Config

Make a `.dlvrtokens` file in your Homedirectory
```
{
  "snyk": "your token",
  "github": "your token"
}
```

Make a `.dlvr` file in your project root with following configuration

```
{
  "snyk": true, // optional
  "compress": [ // optional
    {"in": "./dist/test.txt", "out": "./dist/test.zip"},
    {"in": "./dist/test2.txt", "out": "./dist/test2.zip"}
  ],
  "logfilter": ".*#", // regex - every commit with a # in it, // required
  "remote": "origin", // optional
  "github": { // optional
    "draft":true,  // false: publishes instantly - true: you have to confirm the draft at github release pages
    "repo": "username/repo",
    "release": {
      "assets": [{
        "file": "./dist/test.zip",
        "name": "test.zip"
      },{
        "file": "./dist/test2.zip",
        "name": "test2.zip"
      }]
    }
  },
  "test":"npm run test", // optional
  "npmpublish": false // optional
}

```
